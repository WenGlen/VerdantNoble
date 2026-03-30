import { useState, useEffect, useCallback } from "react";
import ModButton from "../../elements/ModButton";
import { formatCouponRuleLabel } from "../../../../utils/couponNormalize";

const ITEMS_PER_PAGE = 10;

export default function CouponsList({
  coupons,
  mod,
  onEdit,
  deleteTargetId,
  onDeleteMod,
  onCancelDelete,
  onConfirmDelete,
  deleting,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(coupons.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = coupons.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    queueMicrotask(() => setCurrentPage(1));
  }, [coupons.length]);

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

  function formatDueDate(ts) {
    if (ts == null || ts === "") return "—";
    const n = Number(ts);
    if (!Number.isFinite(n)) return "—";
    const d = new Date(n * 1000);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("zh-TW");
  }

  return (
    <>
      <div className="max-w-[960px] flex-1 min-h-0 overflow-y-auto overflow-x-auto flex flex-col p-3 rounded shadow-inner bg-white border border-slate-200 max-md:h-fit">
        <table className="w-full border-collapse text-admin-text text-sm">
          <thead>
            <tr className="text-center bg-slate-200 text-sm">
              <th className="min-w-[40px] py-2" />
              <th className="min-w-[100px] py-2 px-2">折扣碼</th>
              <th className="min-w-[160px] max-w-[240px] py-2 px-2">標題</th>
              <th className="min-w-[88px] py-2 px-1">折扣</th>
              <th className="min-w-[56px] py-2">啟用</th>
              <th className="min-w-[140px] py-2 px-2">到期</th>
              <th className="w-[120px] py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-8 text-center text-admin-text-muted text-sm"
                >
                  尚無優惠券，請點右下「新增優惠券」。
                </td>
              </tr>
            ) : (
              pageItems.map((c, index) => {
                const globalIndex = startIndex + index;
                const muted = !c.is_enabled;
                return (
                  <tr
                    key={c.id || c.code || globalIndex}
                    className={`border-b border-admin-border ${muted ? "text-admin-text-muted" : ""}`}
                  >
                    <td className="text-center py-2 px-2 text-admin-text-muted">
                      {globalIndex + 1}
                    </td>
                    <td
                      className="font-mono py-2 px-2 text-left overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]"
                      title={c.code ?? ""}
                    >
                      {c.code ?? "—"}
                    </td>
                    <td
                      className="font-semibold py-2 px-2 text-left overflow-hidden text-ellipsis whitespace-nowrap min-w-[160px] max-w-[240px]"
                      title={c.title ?? ""}
                    >
                      {c.title ?? "—"}
                    </td>
                    <td className="text-center py-2 px-1 text-xs whitespace-nowrap">
                      {formatCouponRuleLabel(c)}
                    </td>
                    <td className="text-center py-2 px-2">
                      {c.is_enabled ? "✔" : "✖"}
                    </td>
                    <td className="text-right py-2 px-2 whitespace-nowrap text-xs">
                      {formatDueDate(c.due_date)}
                    </td>
                    <td className="text-center py-2 flex-row-center gap-4 [&_img]:my-1">
                      <ModButton
                        type="update"
                        mod={mod}
                        action={() => onEdit(c)}
                      />
                      {c.id ? (
                        <ModButton
                          type="delete"
                          mod={mod}
                          id={c.id}
                          targetId={deleteTargetId}
                          action={() => onDeleteMod(c.id)}
                          onCancel={onCancelDelete}
                          onConfirmDelete={onConfirmDelete}
                          deleteing={deleting}
                        />
                      ) : (
                        <span className="text-xs text-admin-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {coupons.length > ITEMS_PER_PAGE && (
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
                type="button"
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
