import React, { useState, useEffect, useRef, useCallback } from "react";
import ModButton from "../../elements/ModButton";

const CONTAINER_PADDING = 24;
const DEBOUNCE_DELAY = 150;
const INITIAL_CALCULATION_DELAY = 300;

export default function ProductsList({
  products,
  mod,
  setFocus,
  deleteTargetId,
  onDeleteMod,
  onCancelDelete,
  onConfirmDelete,
  deleting,
  editProduct,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const tableContainerRef = useRef(null);
  const tableRef = useRef(null);
  const rowHeightRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const calculateMaxItemsPerPage = useCallback(() => {
    if (!tableContainerRef.current || !tableRef.current) return;
    const container = tableContainerRef.current;
    const table = tableRef.current;
    const containerHeight = container.clientHeight;
    if (containerHeight === 0) return;
    const theadHeight = table.querySelector("thead")?.offsetHeight || 0;
    const availableHeight = containerHeight - theadHeight - CONTAINER_PADDING;
    if (availableHeight <= 0) return;
    let rowHeight = rowHeightRef.current;
    if (!rowHeight || rowHeight <= 0) {
      const rows = table.querySelectorAll("tbody tr");
      if (rows.length === 0) return;
      rowHeight = rows[0].offsetHeight;
      if (rowHeight <= 0) return;
      rowHeightRef.current = rowHeight;
    }
    const calculatedItems = Math.max(
      1,
      Math.floor(availableHeight / rowHeight),
    );
    if (calculatedItems !== itemsPerPage) {
      setItemsPerPage(calculatedItems);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    if (products.length === 0) return;
    const debouncedCalculate = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(
        calculateMaxItemsPerPage,
        DEBOUNCE_DELAY,
      );
    };
    const initialTimeoutId = setTimeout(
      calculateMaxItemsPerPage,
      INITIAL_CALCULATION_DELAY,
    );
    const resizeObserver = new ResizeObserver(debouncedCalculate);
    if (tableContainerRef.current) {
      resizeObserver.observe(tableContainerRef.current);
    }
    window.addEventListener("resize", debouncedCalculate);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedCalculate);
      clearTimeout(initialTimeoutId);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, [products.length, calculateMaxItemsPerPage]);

  useEffect(() => {
    queueMicrotask(() => setCurrentPage(1));
  }, [products.length]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      queueMicrotask(() => setCurrentPage(1));
    }
  }, [currentPage, totalPages]);

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    },
    [totalPages],
  );

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  return (
    <>
      <div
        ref={tableContainerRef}
        className="max-w-[960px] flex-1 min-h-0 overflow-y-auto overflow-x-auto flex flex-col p-3 rounded shadow-inner bg-white border border-slate-200 max-md:h-fit"
      >
        <table ref={tableRef} className="border-collapse text-admin-text">
          <thead>
            <tr className="text-center bg-slate-200 text-sm">
              <th className="" />
              <th className="min-w-[220px] max-w-[220px] py-2">產品名稱</th>
              <th>分類</th>
              <th>售價</th>
              <th>庫存</th>
              <th>上架</th>
              <th className="w-[120px]">操作</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => {
              const globalIndex = startIndex + index;
              return (
                <tr
                  key={product.id}
                  className={`border-b border-admin-border ${product.is_enabled ? "" : "text-admin-text-muted"}`}
                >
                  <td className="min-w-[50px] py-2 px-3"> {globalIndex + 1}</td>
                  <td
                    className="min-w-[220px] max-w-[220px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap py-2 px-3"
                    title={product.title}
                  >
                    {product.title}
                  </td>
                  <td className="text-center min-w-[60px] py-2 px-3">
                    {" "}
                    {product.category}
                  </td>
                  <td className="min-w-[90px] text-right py-2 px-3">
                    {product.price} <span className="text-xs">元</span>
                  </td>
                  <td className="w-[70px] text-right py-2 px-3">
                    {product.stock}{" "}
                    <span className="text-xs">{product.unit}</span>
                  </td>
                  <td className="text-center py-2 px-3">
                    {" "}
                    {product.is_enabled ? "✔" : "✖"}
                  </td>
                  <td className="text-center py-2 flex-row-center gap-4 [&_img]:my-1">
                    <ModButton
                      type="view"
                      mod={mod}
                      action={() => setFocus(product)}
                    />
                    <ModButton
                      type="delete"
                      mod={mod}
                      id={product.id}
                      targetId={deleteTargetId}
                      action={() => onDeleteMod(product.id)}
                      onCancel={onCancelDelete}
                      onConfirmDelete={onConfirmDelete}
                      deleteing={deleting}
                    />
                    <ModButton
                      type="update"
                      mod={mod}
                      action={() => editProduct(product)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-8">
          <button
            type="button"
            className="rotate-180 rounded px-3 py-1.5 bg-admin-card-25 text-admin-text text-sm border-none cursor-pointer hover:bg-admin-card-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            ►
          </button>
          <div className="flex gap-2 items-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`min-w-8 h-8 px-2 rounded text-sm border-none cursor-pointer transition-colors ${
                  currentPage === page
                    ? "bg-admin-primary text-admin-text-invert font-semibold"
                    : "bg-transparent hover:bg-admin-btn-muted"
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="rounded px-3 py-1.5 bg-admin-card-25 text-admin-text text-sm border-none cursor-pointer hover:bg-admin-card-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            ►
          </button>
        </div>
      )}
    </>
  );
}
