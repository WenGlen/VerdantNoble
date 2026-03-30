import React, { useState, useRef } from "react";
import axios from "axios";

export default function EditPanel({
  editingProduct,
  editingProductIsEnabled,
  setEditingProductIsEnabled,
  eventHandlereditingProduct,
  setEditingProductCare,
  mod,
  setMod,
  setFocus,
  resetEditingProduct,
  inputError,
  uploading,
  uploadProduct,
  url,
  path,
}) {
  const [uploadingImage, setUploadingImage] = useState({});
  const [uploadError, setUploadError] = useState({});
  const fileInputRefs = useRef({});

  async function handleImageUpload(file, imageFieldName) {
    setUploadError((prev) => ({ ...prev, [imageFieldName]: "" }));
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError((prev) => ({
        ...prev,
        [imageFieldName]: "圖片格式錯誤，僅支援 jpg、jpeg 與 png 格式",
      }));
      return;
    }
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError((prev) => ({
        ...prev,
        [imageFieldName]: "圖片大小超過 3MB，請選擇較小的圖片",
      }));
      return;
    }
    const formData = new FormData();
    formData.append("file-to-upload", file);
    setUploadingImage((prev) => ({ ...prev, [imageFieldName]: true }));
    try {
      const res = await axios.post(
        `${url}/api/${path}/admin/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (res.data && res.data.imageUrl) {
        eventHandlereditingProduct({
          target: { name: imageFieldName, value: res.data.imageUrl },
        });
        setUploadError((prev) => ({ ...prev, [imageFieldName]: "" }));
      } else {
        setUploadError((prev) => ({
          ...prev,
          [imageFieldName]: "上傳失敗，請重試",
        }));
      }
    } catch {
      setUploadError((prev) => ({
        ...prev,
        [imageFieldName]: "圖片上傳失敗，請檢查網路連線或稍後再試",
      }));
    } finally {
      setUploadingImage((prev) => ({ ...prev, [imageFieldName]: false }));
    }
  }

  function handleFileSelect(e, imageFieldName) {
    const file = e.target.files[0];
    if (file) {
      setUploadError((prev) => ({ ...prev, [imageFieldName]: "" }));
      handleImageUpload(file, imageFieldName);
    }
    e.target.value = "";
  }

  function triggerFileInput(imageFieldName) {
    if (fileInputRefs.current[imageFieldName]) {
      fileInputRefs.current[imageFieldName].click();
    }
  }

  const [activeTab, setActiveTab] = useState("images");

  // ── 養護重點操作（固定三項：光 / 水 / 溫度）──────────
  const CARE_LABELS = ["光照", "水分", "溫濕度"];
  const CARE_DEFAULTS = CARE_LABELS.map(() => ({ title: "", description: "" }));
  const rawCare = Array.isArray(editingProduct.care) ? editingProduct.care : [];
  const care = CARE_DEFAULTS.map((def, i) =>
    rawCare[i] ? { ...def, ...rawCare[i] } : { ...def },
  );

  function updateCareTip(index, field, value) {
    const updated = care.map((t, i) =>
      i === index ? { ...t, [field]: value } : t,
    );
    setEditingProductCare(updated);
  }

  return (
    <div className="h-screen w-[600px] xl:w-[400px] flex flex-col gap-3 overflow-hidden p-4 bg-admin-card-edit tablet:rounded-md">
      <div className="shrink-0 flex flex-col gap-4">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-row items-center gap-1">
            <label htmlFor="title" className="text-xs min-w-8">
              品名
            </label>
            <input
              id="title"
              type="text"
              placeholder="請輸入產品名稱"
              name="title"
              value={editingProduct.title}
              onChange={(e) => eventHandlereditingProduct(e)}
              className="admin-edit-panel__input"
            />
          </div>
          <div className="flex flex-row items-center gap-1">
            <label htmlFor="sub_title" className="text-xs min-w-8">
              副標
            </label>
            <input
              id="sub_title"
              type="text"
              placeholder="請輸入副標"
              name="sub_title"
              value={editingProduct.sub_title}
              onChange={(e) => eventHandlereditingProduct(e)}
              className="admin-edit-panel__input"
            />
          </div>
        </div>
        <div className="flex justify-between items-end gap-4 max-[640px]:flex-col">
          <div className="flex flex-col gap-2 max-[1080px]:w-full">
            <div className="flex flex-row items-center gap-1">
              <label htmlFor="is_enabled" className="text-xs min-w-8">
                是否
                <br />
                啟用
              </label>
              <button
                type="button"
                className={`btn-select px-2 py-1 whitespace-nowrap ${editingProductIsEnabled === 1 ? "active" : ""}`}
                onClick={() => setEditingProductIsEnabled(1)}
              >
                上架
              </button>
              <button
                type="button"
                className={`btn-select px-2 py-1 whitespace-nowrap ${editingProductIsEnabled === 1 ? "" : "active"}`}
                onClick={() => setEditingProductIsEnabled(0)}
              >
                隱藏
              </button>
            </div>
            <div className="flex flex-row items-center gap-1">
              <label htmlFor="origin_price" className="text-xs min-w-8">
                原價
              </label>
              <input
                id="origin_price"
                type="number"
                min="0"
                placeholder="請輸入原價"
                name="origin_price"
                value={editingProduct.origin_price ?? ""}
                onChange={(e) => eventHandlereditingProduct(e)}
                className="admin-edit-panel__input"
              />
            </div>
            <div className="flex flex-row items-center gap-1">
              <label htmlFor="price" className="text-xs min-w-8">
                售價
              </label>
              <input
                id="price"
                type="number"
                min="0"
                placeholder="請輸入售價"
                name="price"
                value={editingProduct.price ?? ""}
                onChange={(e) => eventHandlereditingProduct(e)}
                className="admin-edit-panel__input"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 max-[1080px]:w-full">
            <div className="flex flex-row items-center gap-1">
              <label htmlFor="updated_at" className="text-xs min-w-8">
                更新
                <br />
                日期
              </label>
              <input
                id="updated_at"
                type="date"
                name="updated_at"
                value={editingProduct.updated_at}
                onChange={(e) => eventHandlereditingProduct(e)}
                className="admin-edit-panel__input"
              />
            </div>
            <div className="flex flex-row items-center gap-1">
              <label htmlFor="category" className="text-xs min-w-8">
                分類
              </label>
              <input
                id="category"
                type="text"
                placeholder="請輸入分類"
                name="category"
                value={editingProduct.category}
                onChange={(e) => eventHandlereditingProduct(e)}
                className="admin-edit-panel__input"
              />
            </div>
            <div className="flex flex-row items-center gap-1">
              <label htmlFor="stock" className="text-xs min-w-8">
                庫存
              </label>
              <input
                id="stock"
                type="number"
                placeholder="請輸入庫存"
                name="stock"
                value={editingProduct.stock ?? ""}
                onChange={(e) => eventHandlereditingProduct(e)}
                className="admin-edit-panel__input"
              />
              <input
                id="unit"
                type="text"
                placeholder="單位"
                name="unit"
                value={editingProduct.unit ?? ""}
                onChange={(e) => eventHandlereditingProduct(e)}
                className="admin-edit-panel__input admin-edit-panel__input--narrow"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        {/* ── 分頁標籤 ── */}
        <div className="flex gap-1 shrink-0">
          {[
            { key: "images", label: "圖片" },
            { key: "content", label: "內文" },
            { key: "care", label: "養護重點" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`admin-btn-secondary px-3 py-1 text-xs rounded-b-none rounded-t-lg ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── 分頁內容 ── */}
        <div className="flex-1 min-h-0 overflow-y-auto p-2 rounded rounded-tl-none shadow-inner bg-admin-card-50">
          {/* 圖片 */}
          {activeTab === "images" && (
            <div className="overflow-x-none pb-1">
              <div className="flex flex-row flex-wrap gap-2 justify-center">
                <div className="flex flex-col w-40 gap-1">
                  <label htmlFor="imageUrl">主要圖片（必填）</label>
                  <input
                    id="imageUrl"
                    type="text"
                    placeholder="主要圖片網址"
                    name="imageUrl"
                    value={editingProduct.imageUrl}
                    onChange={(e) => eventHandlereditingProduct(e)}
                    className="admin-edit-panel__input"
                  />
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    ref={(el) => (fileInputRefs.current["imageUrl"] = el)}
                    onChange={(e) => handleFileSelect(e, "imageUrl")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    className="admin-btn-light"
                    onClick={() => triggerFileInput("imageUrl")}
                    disabled={uploadingImage["imageUrl"]}
                  >
                    上傳圖片
                  </button>
                  <div className="w-40 h-[120px] bg-slate-200 flex items-center justify-center object-contain">
                    {editingProduct.imageUrl && (
                      <img
                        src={editingProduct.imageUrl}
                        alt={
                          editingProduct.title
                            ? `${editingProduct.title} 主圖預覽`
                            : "商品主圖預覽"
                        }
                        className="w-40 h-[120px] object-contain block"
                      />
                    )}
                    {uploadingImage["imageUrl"] && (
                      <p className="text-sm text-slate-600 m-0">上傳中...</p>
                    )}
                    {uploadError["imageUrl"] && (
                      <p className="text-sm text-red-600 m-0">
                        {uploadError["imageUrl"]}
                      </p>
                    )}
                  </div>
                </div>
                {[1, 2, 3, 4, 5].map((num) => {
                  const imageFieldName = `imageUrl${num}`;
                  return (
                    <div key={num} className="flex flex-col w-40 gap-1">
                      <label htmlFor={imageFieldName}>
                        圖片{num}（可空白）
                      </label>
                      <input
                        id={imageFieldName}
                        type="text"
                        placeholder={`圖片網址${num} (可空白)`}
                        name={imageFieldName}
                        value={editingProduct[imageFieldName] || ""}
                        onChange={(e) => eventHandlereditingProduct(e)}
                        className="admin-edit-panel__input"
                      />
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        ref={(el) =>
                          (fileInputRefs.current[imageFieldName] = el)
                        }
                        onChange={(e) => handleFileSelect(e, imageFieldName)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        className="admin-btn-light"
                        onClick={() => triggerFileInput(imageFieldName)}
                        disabled={uploadingImage[imageFieldName]}
                      >
                        上傳圖片
                      </button>
                      <div className="w-40 h-[120px] bg-slate-200 flex items-center justify-center object-contain">
                        {editingProduct[imageFieldName] && (
                          <img
                            src={editingProduct[imageFieldName]}
                            alt={
                              editingProduct.title
                                ? `${editingProduct.title} 附加圖預覽`
                                : "商品附加圖預覽"
                            }
                            className="w-40 h-[120px] object-contain block"
                          />
                        )}
                        {uploadingImage[imageFieldName] && (
                          <p className="text-sm text-slate-600 m-0">
                            上傳中...
                          </p>
                        )}
                        {uploadError[imageFieldName] && (
                          <p className="text-sm text-red-600 m-0">
                            {uploadError[imageFieldName]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 內容 */}
          {activeTab === "content" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="content"
                  className="text-xs font-semibold text-slate-500"
                >
                  規格說明
                </label>
                <textarea
                  id="content"
                  name="content"
                  placeholder="請輸入規格說明"
                  value={editingProduct.content}
                  onChange={(e) => eventHandlereditingProduct(e)}
                  className="admin-edit-panel__input admin-edit-panel__input--textarea"
                  rows={4}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="description"
                  className="text-xs font-semibold text-slate-500"
                >
                  描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="請輸入商品描述"
                  value={editingProduct.description}
                  onChange={(e) => eventHandlereditingProduct(e)}
                  className="admin-edit-panel__input admin-edit-panel__input--textarea"
                  rows={4}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="story"
                  className="text-xs font-semibold text-slate-500"
                >
                  故事（選填）
                </label>
                <textarea
                  id="story"
                  name="story"
                  placeholder="請輸入商品故事（選填）"
                  value={editingProduct.story || ""}
                  onChange={(e) => eventHandlereditingProduct(e)}
                  className="admin-edit-panel__input admin-edit-panel__input--textarea"
                  rows={5}
                />
              </div>
            </div>
          )}

          {/* 養護重點 */}
          {activeTab === "care" && (
            <div className="flex flex-col gap-3">
              {care.map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs font-bold text-admin-primary min-w-[36px] pt-2 shrink-0">
                    {CARE_LABELS[i]}
                  </span>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <input
                      type="text"
                      placeholder="標題"
                      value={tip.title || ""}
                      onChange={(e) =>
                        updateCareTip(i, "title", e.target.value)
                      }
                      className="admin-edit-panel__input"
                    />
                    <textarea
                      placeholder="說明文字"
                      value={tip.description || ""}
                      onChange={(e) =>
                        updateCareTip(i, "description", e.target.value)
                      }
                      className="admin-edit-panel__input admin-edit-panel__input--textarea"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="shrink-0 [&_p]:m-0 [&_p]:mb-2">
        <p
          className={`text-sm leading-4 text-right ${inputError ? "text-red-700" : "text-transparent"}`}
        >
          {inputError || "\u00A0"}
        </p>
        <div className="flex justify-between">
          <button
            type="button"
            className="admin-btn-muted"
            disabled={uploading}
            onClick={() => {
              resetEditingProduct();
              setMod("view");
              setFocus({});
            }}
          >
            {mod === "update" ? "取消編輯（不會儲存）" : "取消新增（不會儲存）"}
          </button>
          <button
            type="button"
            className="admin-btn-primary"
            disabled={uploading}
            onClick={() => uploadProduct(mod)}
          >
            {uploading
              ? mod === "update"
                ? "更新產品中..."
                : "加入新產品中..."
              : mod === "update"
                ? "更新產品"
                : "加入新產品"}
          </button>
        </div>
      </div>
    </div>
  );
}
