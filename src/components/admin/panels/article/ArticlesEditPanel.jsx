import { useState, useRef } from 'react';
import axios from 'axios';

const BLOCK_TYPE_LABEL = {
    heading: '🔤 標題',
    text: '📄 文字段落',
    emphasis: '💬 強調引用',
    image: '🖼 圖片',
};

export default function ArticlesEditPanel({
    editingArticle,
    setEditingArticle,
    eventHandlerEditingArticle,
    onBlocksChange,
    mod,
    setMod,
    setFocus,
    uploading,
    fetchingArticle,
    resetEditingArticle,
    inputError,
    uploadArticle,
    url,
    path,
    products = [],
}) {
    const [uploadingImage, setUploadingImage] = useState({});
    const [uploadError, setUploadError] = useState({});
    const [tagInput, setTagInput] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [activeTab, setActiveTab] = useState('basic');
    const fileInputRefs = useRef({});

    const inputBase = "w-full py-2 px-3 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-200";

    // ====== 圖片上傳 ======
    async function handleImageUpload(file, fieldKey) {
        setUploadError(prev => ({ ...prev, [fieldKey]: '' }));
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            setUploadError(prev => ({ ...prev, [fieldKey]: '圖片格式錯誤，僅支援 jpg、jpeg 與 png' }));
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            setUploadError(prev => ({ ...prev, [fieldKey]: '圖片大小超過 3MB' }));
            return;
        }
        const formData = new FormData();
        formData.append('file-to-upload', file);
        setUploadingImage(prev => ({ ...prev, [fieldKey]: true }));
        try {
            const res = await axios.post(`${url}/api/${path}/admin/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data?.imageUrl) {
                if (fieldKey === 'image') {
                    eventHandlerEditingArticle({ target: { name: 'image', value: res.data.imageUrl } });
                } else {
                    const blockIndex = parseInt(fieldKey.split('-')[1]);
                    updateBlock(blockIndex, 'url', res.data.imageUrl);
                }
                setUploadError(prev => ({ ...prev, [fieldKey]: '' }));
            } else {
                setUploadError(prev => ({ ...prev, [fieldKey]: '上傳失敗，請重試' }));
            }
        } catch {
            setUploadError(prev => ({ ...prev, [fieldKey]: '上傳失敗，請檢查網路連線' }));
        } finally {
            setUploadingImage(prev => ({ ...prev, [fieldKey]: false }));
        }
    }

    function handleFileSelect(e, fieldKey) {
        const file = e.target.files[0];
        if (file) handleImageUpload(file, fieldKey);
        e.target.value = '';
    }

    function triggerFileInput(fieldKey) {
        if (fileInputRefs.current[fieldKey]) fileInputRefs.current[fieldKey].click();
    }

    // ====== 標籤管理 ======
    function addTag() {
        const trimmed = tagInput.trim();
        if (!trimmed || editingArticle.tag.includes(trimmed)) return;
        setEditingArticle(prev => ({ ...prev, tag: [...prev.tag, trimmed] }));
        setTagInput("");
    }

    function removeTag(tagToRemove) {
        setEditingArticle(prev => ({ ...prev, tag: prev.tag.filter(t => t !== tagToRemove) }));
    }

    function handleTagKeyDown(e) {
        if (e.key === 'Enter') { e.preventDefault(); addTag(); }
    }

    // ====== Block 操作 ======
    const blocks = editingArticle.content || [];

    function addBlock(type) {
        const newBlock = type === 'image' ? { type: 'image', url: '', caption: '' } : { type, value: '' };
        onBlocksChange([...blocks, newBlock]);
    }

    function updateBlock(index, field, value) {
        onBlocksChange(blocks.map((b, i) => (i === index ? { ...b, [field]: value } : b)));
    }

    function removeBlock(index) {
        onBlocksChange(blocks.filter((_, i) => i !== index));
    }

    function moveBlock(index, direction) {
        const next = index + direction;
        if (next < 0 || next >= blocks.length) return;
        const newBlocks = [...blocks];
        [newBlocks[index], newBlocks[next]] = [newBlocks[next], newBlocks[index]];
        onBlocksChange(newBlocks);
    }

    // ====== 相關商品操作 ======
    const selectedProductIds = editingArticle.relatedProducts || [];

    function addRelatedProduct(productId) {
        if (selectedProductIds.includes(productId) || selectedProductIds.length >= 3) return;
        setEditingArticle(prev => ({ ...prev, relatedProducts: [...prev.relatedProducts, productId] }));
    }

    function removeRelatedProduct(productId) {
        setEditingArticle(prev => ({ ...prev, relatedProducts: prev.relatedProducts.filter(id => id !== productId) }));
    }

    const filteredProducts = products.filter(p =>
        p.title?.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sub_title?.toLowerCase().includes(productSearch.toLowerCase())
    );

    // ====== 載入中狀態 ======
    if (fetchingArticle) {
        return (
            <div className="h-fit xl:h-screen w-[600px] xl:w-[400px] flex-col-center gap-4 p-4 bg-admin-card-edit tablet:rounded-md">
                <p className="text-sm text-admin-text-muted">載入文章內容中...</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-[600px] xl:w-[400px] flex flex-col gap-3 overflow-hidden p-4 bg-admin-card-edit tablet:rounded-md">

            {/* ── 固定：公開狀態 / 作者 / 標題 / 摘要 ── */}
            <div className="shrink-0 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1 shrink-0">
                        <button
                            type="button"
                            className={`btn-select px-2 py-1 whitespace-nowrap ${editingArticle.isPublic ? "active" : ""}`}
                            onClick={() => setEditingArticle(prev => ({ ...prev, isPublic: true }))}
                        >公開</button>
                        <button
                            type="button"
                            className={`btn-select px-2 py-1 whitespace-nowrap ${!editingArticle.isPublic ? "active" : ""}`}
                            onClick={() => setEditingArticle(prev => ({ ...prev, isPublic: false }))}
                        >隱藏</button>
                    </div>
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                        <label htmlFor="author" className="text-xs min-w-8 shrink-0">作者</label>
                        <input
                            id="author"
                            type="text"
                            placeholder="作者名稱"
                            name="author"
                            value={editingArticle.author}
                            onChange={eventHandlerEditingArticle}
                            className={inputBase}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <label htmlFor="title" className="text-xs min-w-8">標題</label>
                    <input
                        id="title"
                        type="text"
                        placeholder="請輸入文章標題"
                        name="title"
                        value={editingArticle.title}
                        onChange={eventHandlerEditingArticle}
                        className={inputBase}
                    />
                </div>
                <div className="flex items-center gap-1">
                    <label htmlFor="description" className="text-xs min-w-8">摘要</label>
                    <input
                        id="description"
                        type="text"
                        placeholder="請輸入文章摘要"
                        name="description"
                        value={editingArticle.description}
                        onChange={eventHandlerEditingArticle}
                        className={inputBase}
                    />
                </div>
            </div>

            {/* ── 分頁 ── */}
            <div className="flex-1 min-h-0 flex flex-col">

                {/* 分頁標籤 */}
                <div className="flex gap-1 shrink-0">
                    {[
                        { key: 'basic',   label: '基本設定' },
                        { key: 'content', label: `內文（${blocks.length}）` },
                        { key: 'related', label: `相關商品（${selectedProductIds.length}/3）` },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            type="button"
                            className={`admin-btn-secondary px-3 py-1 text-xs rounded-b-none rounded-t-lg ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 分頁內容 */}
                <div className="flex-1 min-h-0 flex flex-col rounded rounded-tl-none shadow-inner bg-admin-card-50">

                    {/* ── 基本設定：封面圖片 + 標籤 ── */}
                    {activeTab === 'basic' && (
                        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
                            {/* 封面圖片 */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-500">封面圖片</label>
                                <div className="flex gap-1">
                                    <input
                                        type="text"
                                        placeholder="封面圖片網址"
                                        name="image"
                                        value={editingArticle.image}
                                        onChange={eventHandlerEditingArticle}
                                        className={inputBase}
                                    />
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png"
                                        ref={el => (fileInputRefs.current['image'] = el)}
                                        onChange={e => handleFileSelect(e, 'image')}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        className="admin-btn-light"
                                        onClick={() => triggerFileInput('image')}
                                        disabled={uploadingImage['image']}
                                    >
                                        {uploadingImage['image'] ? '上傳中' : '上傳'}
                                    </button>
                                </div>
                                {editingArticle.image && (
                                    <div className="w-full h-[120px] bg-slate-200 overflow-hidden rounded">
                                        <img src={editingArticle.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                {uploadError['image'] && (
                                    <p className="text-xs text-red-600 m-0">{uploadError['image']}</p>
                                )}
                            </div>

                            {/* 標籤 */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-slate-500">標籤</label>
                                {editingArticle.tag.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-1">
                                        {editingArticle.tag.map((t, i) => (
                                            <span key={i} className="flex items-center gap-0.5 text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                                {t}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(t)}
                                                    className="ml-0.5 text-slate-400 hover:text-red-500 border-none bg-transparent cursor-pointer p-0 leading-none"
                                                >✕</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-1">
                                    <input
                                        type="text"
                                        placeholder="輸入標籤後按 Enter"
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        className={inputBase}
                                    />
                                    <button type="button" className="admin-btn-light" onClick={addTag}>新增</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── 內文：Block 編輯器 ── */}
                    {activeTab === 'content' && (
                        <div className="flex-1 min-h-0 flex flex-col">
                            {/* 新增按鈕列（固定，不滾動） */}
                            <div className="shrink-0 flex flex-wrap gap-1 px-3 py-2 border-b border-slate-200">
                                <button type="button" className="admin-btn-light" onClick={() => addBlock('heading')}>+ 標題</button>
                                <button type="button" className="admin-btn-light" onClick={() => addBlock('text')}>+ 文字</button>
                                <button type="button" className="admin-btn-light" onClick={() => addBlock('emphasis')}>+ 強調</button>
                                <button type="button" className="admin-btn-light" onClick={() => addBlock('image')}>+ 圖片</button>
                            </div>

                            {/* Block 清單（可滾動） */}
                            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
                            {blocks.length === 0 ? (
                                <p className="text-xs text-center text-admin-text-muted py-6">
                                    尚未新增任何區塊，點擊上方按鈕開始
                                </p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {blocks.map((block, index) => (
                                        <div key={index} className="bg-white border border-slate-200 rounded p-2 flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-slate-500">
                                                    {BLOCK_TYPE_LABEL[block.type] || block.type}
                                                </span>
                                                <div className="flex gap-1">
                                                    <button type="button" className="text-xs px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border-none cursor-pointer disabled:opacity-30" onClick={() => moveBlock(index, -1)} disabled={index === 0}>↑</button>
                                                    <button type="button" className="text-xs px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 border-none cursor-pointer disabled:opacity-30" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1}>↓</button>
                                                    <button type="button" className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-500 hover:bg-red-100 border-none cursor-pointer" onClick={() => removeBlock(index)}>✕</button>
                                                </div>
                                            </div>

                                            {block.type === 'heading' && (
                                                <input
                                                    type="text"
                                                    placeholder="請輸入標題文字..."
                                                    value={block.value}
                                                    onChange={e => updateBlock(index, 'value', e.target.value)}
                                                    className={`${inputBase} font-semibold text-base`}
                                                />
                                            )}

                                            {(block.type === 'text' || block.type === 'emphasis') && (
                                                <textarea
                                                    placeholder={block.type === 'text' ? '請輸入段落文字...' : '請輸入強調引用文字...'}
                                                    value={block.value}
                                                    onChange={e => updateBlock(index, 'value', e.target.value)}
                                                    rows={3}
                                                    className={`${inputBase} resize-y text-sm ${block.type === 'emphasis' ? 'italic' : ''}`}
                                                />
                                            )}

                                            {block.type === 'image' && (
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex gap-1">
                                                        <input
                                                            type="text"
                                                            placeholder="圖片網址"
                                                            value={block.url}
                                                            onChange={e => updateBlock(index, 'url', e.target.value)}
                                                            className={`${inputBase} text-sm`}
                                                        />
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg,image/jpg,image/png"
                                                            ref={el => (fileInputRefs.current[`block-${index}`] = el)}
                                                            onChange={e => handleFileSelect(e, `block-${index}`)}
                                                            className="hidden"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="admin-btn-light"
                                                            onClick={() => triggerFileInput(`block-${index}`)}
                                                            disabled={uploadingImage[`block-${index}`]}
                                                        >
                                                            {uploadingImage[`block-${index}`] ? '上傳中' : '上傳'}
                                                        </button>
                                                    </div>
                                                    {block.url && (
                                                        <div className="w-full h-[70px] bg-slate-100 overflow-hidden rounded">
                                                            <img src={block.url} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                    {uploadError[`block-${index}`] && (
                                                        <p className="text-xs text-red-600 m-0">{uploadError[`block-${index}`]}</p>
                                                    )}
                                                    <input
                                                        type="text"
                                                        placeholder="圖片說明（可空白）"
                                                        value={block.caption}
                                                        onChange={e => updateBlock(index, 'caption', e.target.value)}
                                                        className={`${inputBase} text-sm`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            </div>{/* end 可滾動 block 清單 */}
                        </div>
                    )}

                    {/* ── 相關商品 ── */}
                    {activeTab === 'related' && (
                        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                            <p className="text-xs text-admin-text-muted">最多可選 3 個商品，將顯示於文章底部。</p>

                            {/* 已選商品 */}
                            {selectedProductIds.length > 0 && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-admin-text">已選商品</label>
                                    {selectedProductIds.map(id => {
                                        const p = products.find(p => p.id === id);
                                        if (!p) return null;
                                        return (
                                            <div key={id} className="flex items-center gap-2 px-2 py-1.5 rounded bg-admin-card text-xs">
                                                {p.imageUrl && (
                                                    <img src={p.imageUrl} alt={p.title} className="w-8 h-8 object-cover rounded shrink-0" />
                                                )}
                                                <span className="flex-1 min-w-0 truncate">{p.title}{p.sub_title ? `・${p.sub_title}` : ''}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeRelatedProduct(id)}
                                                    className="text-slate-400 hover:text-red-500 border-none bg-transparent cursor-pointer p-0 leading-none shrink-0"
                                                >✕</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* 商品選擇器 */}
                            {selectedProductIds.length < 3 && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-admin-text">新增商品</label>
                                    <input
                                        type="text"
                                        placeholder="搜尋商品名稱..."
                                        value={productSearch}
                                        onChange={e => setProductSearch(e.target.value)}
                                        className={`${inputBase} text-xs`}
                                    />
                                    <div className="flex flex-col rounded bg-admin-card-50 overflow-hidden">
                                        {filteredProducts.length === 0 ? (
                                            <p className="text-xs text-admin-text-muted text-center py-3">無符合商品</p>
                                        ) : (
                                            filteredProducts.map(p => {
                                                const isSelected = selectedProductIds.includes(p.id);
                                                return (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        disabled={isSelected}
                                                        onClick={() => addRelatedProduct(p.id)}
                                                        className="flex items-center gap-2 px-2 py-2 text-xs text-left border-none  cursor-pointer hover:bg-admin-card disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        {p.imageUrl && (
                                                            <img src={p.imageUrl} alt={p.title} className="w-8 h-8 object-cover rounded shrink-0" />
                                                        )}
                                                        <span className="flex-1 min-w-0 truncate">{p.title}{p.sub_title ? `・${p.sub_title}` : ''}</span>
                                                        {isSelected
                                                            ? <span className="text-admin-text-muted shrink-0">已選</span>
                                                            : <span className="text-admin-primary shrink-0">＋</span>
                                                        }
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* ── 固定：操作按鈕 ── */}
            <div className="shrink-0 [&_p]:m-0 [&_p]:mb-2">
                <p className={`text-sm leading-4 text-right ${inputError ? "text-red-700" : "text-transparent"}`}>
                    {inputError || "\u00A0"}
                </p>
                <div className="flex justify-between">
                    <button
                        type="button"
                        className="admin-btn-muted"
                        disabled={uploading}
                        onClick={() => { resetEditingArticle(); setMod("view"); setFocus({}); }}
                    >
                        {mod === "update" ? "取消編輯（不會儲存）" : "取消新增（不會儲存）"}
                    </button>
                    <button
                        type="button"
                        className="admin-btn-primary"
                        disabled={uploading}
                        onClick={() => uploadArticle(mod)}
                    >
                        {uploading
                            ? (mod === "update" ? "更新文章中..." : "加入新文章中...")
                            : (mod === "update" ? "更新文章" : "加入新文章")}
                    </button>
                </div>
            </div>

        </div>
    );
}
