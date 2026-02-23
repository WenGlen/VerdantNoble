import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function EditPanel({
    editingProduct,
    editingProductIsEnabled,
    setEditingProductIsEnabled,
    eventHandlereditingProduct,
    mod,
    setMod,
    setFocus,
    resetEditingProduct,
    inputError,
    uploading,
    uploadProduct,
    url,
    path
}) {
    const [uploadingImage, setUploadingImage] = useState({});
    const [uploadError, setUploadError] = useState({});
    const fileInputRefs = useRef({});

    async function handleImageUpload(file, imageFieldName) {
        setUploadError(prev => ({ ...prev, [imageFieldName]: '' }));
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError(prev => ({ ...prev, [imageFieldName]: '圖片格式錯誤，僅支援 jpg、jpeg 與 png 格式' }));
            return;
        }
        const maxSize = 3 * 1024 * 1024;
        if (file.size > maxSize) {
            setUploadError(prev => ({ ...prev, [imageFieldName]: '圖片大小超過 3MB，請選擇較小的圖片' }));
            return;
        }
        const formData = new FormData();
        formData.append('file-to-upload', file);
        setUploadingImage(prev => ({ ...prev, [imageFieldName]: true }));
        try {
            const res = await axios.post(`${url}/api/${path}/admin/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data && res.data.imageUrl) {
                eventHandlereditingProduct({
                    target: { name: imageFieldName, value: res.data.imageUrl }
                });
                setUploadError(prev => ({ ...prev, [imageFieldName]: '' }));
            } else {
                setUploadError(prev => ({ ...prev, [imageFieldName]: '上傳失敗，請重試' }));
            }
        } catch (error) {
            console.error('圖片上傳錯誤:', error);
            setUploadError(prev => ({ ...prev, [imageFieldName]: '圖片上傳失敗，請檢查網路連線或稍後再試' }));
        } finally {
            setUploadingImage(prev => ({ ...prev, [imageFieldName]: false }));
        }
    }

    function handleFileSelect(e, imageFieldName) {
        const file = e.target.files[0];
        if (file) {
            setUploadError(prev => ({ ...prev, [imageFieldName]: '' }));
            handleImageUpload(file, imageFieldName);
        }
        e.target.value = '';
    }

    function triggerFileInput(imageFieldName) {
        if (fileInputRefs.current[imageFieldName]) {
            fileInputRefs.current[imageFieldName].click();
        }
    }

    const panelBg = mod === "add" ? "bg-amber-100" : mod === "update" ? "bg-sky-100" : "";
    const frameBg = mod === "update" ? "bg-sky-200 border border-slate-200" : mod === "add" ? "bg-amber-200" : "";
    const btnLight = "mx-1 rounded px-2 py-1 font-semibold cursor-pointer bg-slate-200 text-slate-800 border-none hover:bg-sky-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:font-normal disabled:hover:bg-slate-200";
    const inputBase = "w-full py-2 px-3 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-200";

    return (
        <div className="h-screen w-[400px] flex-col-between gap-2 overflow-x-auto p-4 bg-admin-card-edit">
            <div className="h-full w-full flex flex-col gap-4">
                <div className="flex flex-col gap-4 justify-between">
                    <div className="flex flex-col gap-2 max-[1080px]:w-full">
                        <div className="flex flex-row items-center gap-1">
                            <label htmlFor="title" className="text-xs min-w-6">品名</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="請輸入產品名稱"
                                name="title"
                                value={editingProduct.title}
                                onChange={(e) => eventHandlereditingProduct(e)}
                                className={inputBase}
                            />
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <label htmlFor="sub_title" className="text-xs min-w-6">副標</label>
                            <input
                                id="sub_title"
                                type="text"
                                placeholder="請輸入副標"
                                name="sub_title"
                                value={editingProduct.sub_title}
                                onChange={(e) => eventHandlereditingProduct(e)}
                                className={inputBase}
                            />
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <label htmlFor="content" className="text-xs min-w-6">規格</label>
                            <input
                                id="content"
                                type="text"
                                placeholder="請輸入內容"
                                name="content"
                                value={editingProduct.content}
                                onChange={(e) => eventHandlereditingProduct(e)}
                                className={inputBase}
                            />
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <label htmlFor="description" className="text-xs min-w-6">描述</label>
                            <input
                                id="description"
                                type="text"
                                placeholder="請輸入描述"
                                name="description"
                                value={editingProduct.description}
                                onChange={(e) => eventHandlereditingProduct(e)}
                                className={inputBase}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-end gap-4 max-[640px]:flex-col">
                        <div className="flex flex-col gap-2 max-[1080px]:w-full">
                            <div className="flex flex-row items-center gap-1">
                                <label htmlFor="is_enabled" className="text-xs min-w-6">是否<br />啟用</label>
                                <button
                                    type="button"
                                    className={`${btnLight} ${editingProductIsEnabled === 1 ? "!bg-sky-700 !text-slate-100" : ""}`}
                                    onClick={() => setEditingProductIsEnabled(1)}
                                >
                                    上架
                                </button>
                                <button
                                    type="button"
                                    className={`${btnLight} ${editingProductIsEnabled === 1 ? "" : "!bg-sky-700 !text-slate-100"}`}
                                    onClick={() => setEditingProductIsEnabled(0)}
                                >
                                    隱藏
                                </button>
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <label htmlFor="origin_price" className="text-xs min-w-6">原價</label>
                                <input
                                    id="origin_price"
                                    type="number"
                                    min="0"
                                    placeholder="請輸入原價"
                                    name="origin_price"
                                    value={editingProduct.origin_price ?? ""}
                                    onChange={(e) => eventHandlereditingProduct(e)}
                                    className={inputBase}
                                />
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <label htmlFor="price" className="text-xs min-w-6">售價</label>
                                <input
                                    id="price"
                                    type="number"
                                    min="0"
                                    placeholder="請輸入售價"
                                    name="price"
                                    value={editingProduct.price ?? ""}
                                    onChange={(e) => eventHandlereditingProduct(e)}
                                    className={inputBase}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 max-[1080px]:w-full">
                            <div className="flex flex-row items-center gap-1">
                                <label htmlFor="category" className="text-xs min-w-6">分類</label>
                                <input
                                    id="category"
                                    type="text"
                                    placeholder="請輸入分類"
                                    name="category"
                                    value={editingProduct.category}
                                    onChange={(e) => eventHandlereditingProduct(e)}
                                    className={inputBase}
                                />
                            </div>
                            <div className="flex flex-row items-center gap-1">
                                <label htmlFor="stock" className="text-xs min-w-6">庫存</label>
                                <input
                                    id="stock"
                                    type="number"
                                    placeholder="請輸入庫存"
                                    name="stock"
                                    value={editingProduct.stock ?? ""}
                                    onChange={(e) => eventHandlereditingProduct(e)}
                                    className={inputBase}
                                />
                                <input
                                    id="unit"
                                    type="text"
                                    placeholder="單位"
                                    name="unit"
                                    value={editingProduct.unit ?? ""}
                                    onChange={(e) => eventHandlereditingProduct(e)}
                                    className={`${inputBase} w-[60px]`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-auto flex flex-col p-2 rounded shadow-inner bg-admin-card-50">
                    <div className="flex-row-center flex-wrap gap-2">
                        <div className="flex flex-col w-40 gap-1">
                            <label htmlFor="imageUrl">主要圖片（必填）</label>
                            <input
                                id="imageUrl"
                                type="text"
                                placeholder="主要圖片網址"
                                name="imageUrl"
                                value={editingProduct.imageUrl}
                                onChange={(e) => eventHandlereditingProduct(e)}
                                className={inputBase}
                            />
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                ref={el => (fileInputRefs.current['imageUrl'] = el)}
                                onChange={(e) => handleFileSelect(e, 'imageUrl')}
                                className="hidden"
                            />
                            <button
                                type="button"
                                className={btnLight}
                                onClick={() => triggerFileInput('imageUrl')}
                                disabled={uploadingImage['imageUrl']}
                            >
                                上傳圖片
                            </button>
                            <div className="w-40 h-[120px] bg-slate-200 flex items-center justify-center object-contain">
                                {editingProduct.imageUrl && (
                                    <img src={editingProduct.imageUrl} alt={editingProduct.imageUrl} className="w-40 h-[120px] object-contain block" />
                                )}
                                {uploadingImage['imageUrl'] && <p className="text-sm text-slate-600 m-0">上傳中...</p>}
                                {uploadError['imageUrl'] && <p className="text-sm text-red-600 m-0">{uploadError['imageUrl']}</p>}
                            </div>
                        </div>
                        {[1, 2, 3, 4, 5].map((num) => {
                            const imageFieldName = `imageUrl${num}`;
                            return (
                                <div key={num} className="flex flex-col w-40 gap-1">
                                    <label htmlFor={imageFieldName}>圖片{num}（可空白）</label>
                                    <input
                                        id={imageFieldName}
                                        type="text"
                                        placeholder={`圖片網址${num} (可空白)`}
                                        name={imageFieldName}
                                        value={editingProduct[imageFieldName] || ""}
                                        onChange={(e) => eventHandlereditingProduct(e)}
                                        className={inputBase}
                                    />
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png"
                                        ref={el => (fileInputRefs.current[imageFieldName] = el)}
                                        onChange={(e) => handleFileSelect(e, imageFieldName)}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        className={btnLight}
                                        onClick={() => triggerFileInput(imageFieldName)}
                                        disabled={uploadingImage[imageFieldName]}
                                    >
                                        上傳圖片
                                    </button>
                                    <div className="w-40 h-[120px] bg-slate-200 flex items-center justify-center object-contain">
                                        {editingProduct[imageFieldName] && (
                                            <img src={editingProduct[imageFieldName]} alt={editingProduct[imageFieldName]} className="w-40 h-[120px] object-contain block" />
                                        )}
                                        {uploadingImage[imageFieldName] && <p className="text-sm text-slate-600 m-0">上傳中...</p>}
                                        {uploadError[imageFieldName] && <p className="text-sm text-red-600 m-0">{uploadError[imageFieldName]}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="[&_p]:m-0 [&_p]:mb-2">
                    <p className={`text-sm leading-4 text-right ${inputError ? "text-red-700" : "text-transparent"}`}>
                        {inputError || "\u00A0"}
                    </p>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            className={`${btnLight} ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => { resetEditingProduct(); setMod("view"); setFocus({}); }}
                        >
                            {mod === "update" ? "取消編輯（產品不會儲存）" : "取消新增（產品不會儲存）"}
                        </button>
                        <button
                            type="button"
                            className={`rounded px-2 py-1 bg-sky-700 text-slate-100 border-none cursor-pointer hover:bg-sky-600 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => uploadProduct(mod)}
                        >
                            {uploading
                                ? (mod === "update" ? "更新產品中..." : "加入新產品中...")
                                : (mod === "update" ? "更新產品" : "加入新產品")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
