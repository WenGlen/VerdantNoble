import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { useDispatch } from "react-redux";
const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

import { createAsyncDashboardToast } from "../../../slices/DashboardToastSlice";
import ModButton from "../../../components/admin/elements/ModButton";
import FoucsPanel from "../../../components/admin/panels/product/FoucsPanel";
import EditPanel from "../../../components/admin/panels/product/EditPanel";
import ProductsList from "../../../components/admin/panels/product/ProductsList";

/** 先依分類再依品名（中文）排序；純函式，放在元件外避免 useCallback 依賴變動 */
function sortProductsByCategoryAndTitle(products) {
  const sortedProducts = [...products];
  sortedProducts.sort((a, b) => {
    const categoryA = a.category || "";
    const categoryB = b.category || "";
    const categoryCompare = categoryA.localeCompare(categoryB, "zh-CN", {
      numeric: true,
      sensitivity: "base",
    });
    if (categoryCompare === 0) {
      const titleA = a.title || "";
      const titleB = b.title || "";
      return titleA.localeCompare(titleB, "zh-CN", {
        numeric: true,
        sensitivity: "base",
      });
    }
    return categoryCompare;
  });
  return sortedProducts;
}

export default function ProductsManagement() {
  const [mod, setMod] = useState("view");
  const [products, setProducts] = useState([]);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const dispatch = useDispatch();

  const [focus, setFocus] = useState({});
  const [editingProductIsEnabled, setEditingProductIsEnabled] = useState(1);
  const [editingProduct, setEditingProduct] = useState({});
  const [inputError, setInputError] = useState("");

  function parseCare(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim()) {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return [];
  }

  const resetEditingProduct = useCallback(() => {
    setEditingProduct({
      title: "",
      sub_title: "",
      category: "",
      origin_price: null,
      price: null,
      updated_at: "",
      stock: null,
      unit: "",
      description: "",
      content: "",
      story: "",
      is_enabled: 1,
      is_featured: false,
      care: [],
      imageUrl: "",
      imageUrl1: "",
      imageUrl2: "",
      imageUrl3: "",
      imageUrl4: "",
      imageUrl5: "",
      soldQuantity: 0,
    });
    setEditingProductIsEnabled(1);
    setInputError("");
  }, []);

  useEffect(() => {
    if (mod === "add") {
      resetEditingProduct();
    }
  }, [mod, resetEditingProduct]);

  const getProducts = useCallback(async () => {
    setMod("get");
    setFocus({});
    try {
      const res = await axios.get(
        `${VITE_API_URL}/api/${VITE_API_PATH}/admin/products/all`,
      );
      if (res.data.products) {
        const resProducts = Object.values(res.data.products);
        resProducts.forEach((product) => {
          const imagesArray = product.imagesUrl || [];
          product.imageUrl1 = imagesArray[0] || "";
          product.imageUrl2 = imagesArray[1] || "";
          product.imageUrl3 = imagesArray[2] || "";
          product.imageUrl4 = imagesArray[3] || "";
          product.imageUrl5 = imagesArray[4] || "";
        });
        const sortedProducts = sortProductsByCategoryAndTitle(resProducts);
        setProducts(sortedProducts);
        setFirstTimeLoading(false);
        dispatch(
          createAsyncDashboardToast({
            message: "成功取得產品列表",
            success: true,
          }),
        );
      } else {
        setProducts([]);
        dispatch(
          createAsyncDashboardToast({
            message: "取得產品列表失敗",
            success: false,
          }),
        );
      }
    } catch (error) {
      setProducts([]);
      dispatch(createAsyncDashboardToast(error.response.data));
    }
    setMod("view");
    resetEditingProduct();
  }, [dispatch, resetEditingProduct]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  //====== 刪除功能 ======
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [deleting, setDeleting] = useState(false);

  function DeleteMod(id) {
    setMod("delete");
    setDeleteTargetId(id);
  }

  async function deleteProduct(id) {
    setDeleting(true);
    try {
      await axios.delete(
        `${VITE_API_URL}/api/${VITE_API_PATH}/admin/product/${id}`,
      );
      getProducts();
      setFocus({});
      setMod("view");
      setDeleteTargetId("");
      dispatch(
        createAsyncDashboardToast({ message: "成功刪除產品", success: true }),
      );
    } catch (error) {
      setMod("view");
      dispatch(createAsyncDashboardToast(error.response.data));
      dispatch(
        createAsyncDashboardToast({ message: "刪除產品失敗", success: false }),
      );
    } finally {
      setDeleting(false);
    }
  }

  function handleCancelDelete() {
    setMod("view");
    setDeleteTargetId("");
  }

  function eventHandlereditingProduct(e) {
    const { value, name } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]:
        name === "origin_price" ||
        name === "price" ||
        name === "stock" ||
        name === "soldQuantity"
          ? parseInt(value) || 0
          : value,
    });
  }

  //====== 編輯產品資訊用（還沒上傳） ======
  function editProduct(item) {
    setFocus({ ...item });
    setMod("update");
    setEditingProduct({
      title: item.title || "",
      sub_title: item.sub_title || "",
      category: item.category || "",
      origin_price: item.origin_price || 0,
      price: item.price || 0,
      updated_at: item.updated_at || "",
      stock: item.stock || 0,
      soldQuantity: item.soldQuantity || 0,
      unit: item.unit || "個",
      description: item.description || "",
      content: item.content || "",
      story: item.story || "",
      is_enabled: item.is_enabled !== undefined ? item.is_enabled : 1,
      is_featured: item.is_featured === true,
      care: parseCare(item.care),
      imageUrl: item.imageUrl || "",
      imageUrl1: item.imageUrl1 || "",
      imageUrl2: item.imageUrl2 || "",
      imageUrl3: item.imageUrl3 || "",
      imageUrl4: item.imageUrl4 || "",
      imageUrl5: item.imageUrl5 || "",
    });
    setEditingProductIsEnabled(
      item.is_enabled !== undefined ? item.is_enabled : 1,
    );
    setInputError("");
  }

  //====== 新增/更新 產品用 ======
  const [uploading, setUploading] = useState(false);

  async function uploadProduct(mod) {
    if (mod !== "add" && mod !== "update") return;
    setUploading(true);
    setInputError("");
    const error = checkInputError();
    if (error !== "") {
      setUploading(false);
      setInputError(error);
      return;
    }
    const uploadItem = prepareProductData(
      editingProduct,
      editingProductIsEnabled,
    );
    try {
      if (mod === "add") {
        await axios.post(
          `${VITE_API_URL}/api/${VITE_API_PATH}/admin/product`,
          uploadItem,
        );
        dispatch(
          createAsyncDashboardToast({ message: "新增產品成功", success: true }),
        );
      } else {
        await axios.put(
          `${VITE_API_URL}/api/${VITE_API_PATH}/admin/product/${focus.id}`,
          uploadItem,
        );
        dispatch(
          createAsyncDashboardToast({ message: "更新產品成功", success: true }),
        );
      }
      getProducts();
    } catch (error) {
      const apiMessage = error.response?.data?.message;
      setInputError(apiMessage || "上傳產品失敗，請稍後再試");
      dispatch(
        createAsyncDashboardToast(
          error.response?.data ?? { message: "上傳產品失敗", success: false },
        ),
      );
    } finally {
      setUploading(false);
    }
  }

  const REQUIRED_FIELD_LABELS = {
    title: "品名",
    category: "分類",
    updated_at: "更新日期",
    unit: "單位",
    description: "描述",
    content: "規格說明",
    imageUrl: "主要圖片",
  };

  function checkInputError() {
    for (const [key, label] of Object.entries(REQUIRED_FIELD_LABELS)) {
      if (!editingProduct[key] || editingProduct[key] === "") {
        return `「${label}」為必填欄位，請完整填寫`;
      }
    }
    if (
      typeof editingProduct.origin_price !== "number" ||
      typeof editingProduct.price !== "number" ||
      typeof editingProduct.stock !== "number" ||
      typeof editingProduct.soldQuantity !== "number"
    ) {
      return "原價、售價、庫存請填寫純數字";
    }
    if (
      editingProduct.origin_price < 0 ||
      editingProduct.price < 0 ||
      editingProduct.stock < 0 ||
      editingProduct.soldQuantity < 0
    ) {
      return "原價、售價、庫存當中有負數資訊";
    }
    if (editingProduct.origin_price < editingProduct.price) {
      return "原價不能小於售價";
    }
    return "";
  }

  function setEditingProductCare(newCare) {
    setEditingProduct((prev) => ({ ...prev, care: newCare }));
  }

  function prepareProductData(product, isEnabled) {
    const productCopy = { ...product };
    productCopy.is_enabled = isEnabled;
    // 序列化 care：三個項目全空則存 []，否則存完整陣列
    const careArray = Array.isArray(productCopy.care) ? productCopy.care : [];
    const careHasContent = careArray.some(
      (t) => t.title?.trim() || t.description?.trim(),
    );
    productCopy.care = JSON.stringify(careHasContent ? careArray : []);
    const imagesUrlArray = [
      productCopy.imageUrl1,
      productCopy.imageUrl2,
      productCopy.imageUrl3,
      productCopy.imageUrl4,
      productCopy.imageUrl5,
    ].filter((url) => url && url.trim() !== "");
    const productData = { ...productCopy };
    delete productData.imageUrl1;
    delete productData.imageUrl2;
    delete productData.imageUrl3;
    delete productData.imageUrl4;
    delete productData.imageUrl5;
    return { data: { ...productData, imagesUrl: imagesUrlArray } };
  }

  //======  RWD變彈窗，偵測用 ======
  const [WindowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {firstTimeLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-80 h-[300px] p-3 flex flex-col gap-6 justify-center items-center rounded-lg bg-admin-card-50 shadow-md">
            <Oval
              height={80}
              width={80}
              color="var(--color-admin-text-hover)"
              secondaryColor="var(--color-admin-bg)"
              strokeWidth={6}
            />
            <p className="text-sm text-center">資料讀取中...</p>
          </div>
        </div>
      ) : (
        <div className="relative flex-row-between-center gap-6 pl-12 h-screen">
          {/* 先佔位之後再調排版 */}
          <div />
          {/* 產品列表 */}
          <div className="h-[90vh] max-h-[90vh] w-fit min-w-[720px] p-6 rounded-lg bg-admin-card shadow-md flex flex-col gap-6">
            <ProductsList
              products={products}
              mod={mod}
              setFocus={setFocus}
              deleteTargetId={deleteTargetId}
              onDeleteMod={DeleteMod}
              onCancelDelete={handleCancelDelete}
              onConfirmDelete={deleteProduct}
              deleting={deleting}
              editProduct={editProduct}
            />
            <div className="flex justify-between ">
              <ModButton type="get" mod={mod} action={() => getProducts()} />
              <ModButton type="add" mod={mod} action={() => setMod("add")} />
            </div>
          </div>
          {/* 編輯面板 */}
          <div
            className={`RWD-overlay ${mod == "view" && !focus.id && WindowWidth < 1280 ? "hidden" : ""}`}
          >
            <div className="RWD-container">
              <div className="RWD-content">
                {mod !== "add" && mod !== "update" ? (
                  <FoucsPanel
                    focus={focus}
                    setFocus={setFocus}
                    editProduct={editProduct}
                    setMod={setMod}
                  />
                ) : (
                  <EditPanel
                    editingProduct={editingProduct}
                    editingProductIsEnabled={editingProductIsEnabled}
                    setEditingProductIsEnabled={setEditingProductIsEnabled}
                    eventHandlereditingProduct={eventHandlereditingProduct}
                    setEditingProductCare={setEditingProductCare}
                    mod={mod}
                    setMod={setMod}
                    setFocus={setFocus}
                    uploading={uploading}
                    resetEditingProduct={resetEditingProduct}
                    inputError={inputError}
                    uploadProduct={uploadProduct}
                    url={VITE_API_URL}
                    path={VITE_API_PATH}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="tablet:block hidden" />
        </div>
      )}
    </>
  );
}
