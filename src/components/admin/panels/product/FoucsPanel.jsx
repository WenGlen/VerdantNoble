import { useState } from 'react';

function formatDate(value) {
    if (!value) return "—";
    if (typeof value === 'number') {
        const d = new Date(value * 1000);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    }
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.slice(0, 10).replace(/-/g, '/');
    }
    return String(value);
}

export default function FoucsPanel({ focus, setFocus, editProduct, setMod }) {
    const [activeTab, setActiveTab] = useState('images');

    const FocusPanelItem = ({ label, value }) => (
        <div className="flex justify-between">
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );

    const imageEntries = [
        { label: '主要圖片', src: focus.imageUrl },
        { label: '圖片 1',   src: focus.imageUrl1 },
        { label: '圖片 2',   src: focus.imageUrl2 },
        { label: '圖片 3',   src: focus.imageUrl3 },
        { label: '圖片 4',   src: focus.imageUrl4 },
        { label: '圖片 5',   src: focus.imageUrl5 },
    ];

    const CARE_LABELS = ['光照', '水分', '溫濕度'];
    function parseCare(value) {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string' && value.trim()) {
            try { return JSON.parse(value); } catch { return []; }
        }
        return [];
    }
    const care = parseCare(focus.care);

    return (
        <div className="h-full flex justify-center items-center">
            {!focus.id ? (
                <div className="h-fit xl:h-screen w-[400px] flex-col-center gap-2 overflow-x-auto p-4 bg-admin-card-focus tablet:rounded-md">
                    <p className="text-center text-sm text-slate-600">
                        點擊「操作」按鈕，可查看或編輯產品詳細資訊
                        <br />
                        點擊「新增產品」按鈕，可新增產品
                    </p>
                </div>
            ) : (
                <div className="h-fit xl:h-screen w-[600px] xl:w-[400px] flex-col-between gap-2 p-4 overflow-x-auto bg-admin-card-focus tablet:rounded-md">

                    {/* ── 固定：標題 + 數字資訊 ── */}
                    <div className="shrink-0 flex flex-col gap-2 py-2">
                        <div className="space-y-0.5 text-sm">
                            <h3 className="text-admin-text">{focus.title}</h3>
                            <p className={focus.sub_title ? "font-semibold text-admin-primary" : "text-admin-text-muted"}>
                                {focus.sub_title || "無副標"}
                            </p>
                        </div>
                        <div className="flex-row-center-center gap-8 text-sm">
                            <div className="w-[160px] space-y-1">
                                <FocusPanelItem label="是否啟用：" value={focus.is_enabled ? "上架" : "隱藏"} />
                                <FocusPanelItem label="原價：" value={focus.origin_price} />
                                <FocusPanelItem label="折扣：" value={`${Math.round((focus.price / focus.origin_price) * 100)}%`} />
                                <FocusPanelItem label="售價：" value={focus.price} />
                            </div>
                            <div className="w-[1px] h-[100px] bg-admin-border" />
                            <div className="w-[160px] space-y-1">
                                <FocusPanelItem label="更新：" value={formatDate(focus.updated_at)} />
                                <FocusPanelItem label="分類：" value={focus.category} />
                                <FocusPanelItem label="已售數量：" value={focus.soldQuantity || 0} />
                                <FocusPanelItem label="庫存：" value={focus.stock} />
                            </div>
                        </div>
                    </div>

                    {/* ── 分頁 ── */}
                    <div className="flex-1 min-h-0 flex flex-col">

                        {/* 分頁標籤 */}
                        <div className="flex gap-1 shrink-0">
                            {[
                                { key: 'images',  label: '圖片' },
                                { key: 'content', label: '內文' },
                                { key: 'care',    label: '養護重點' },
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
                        <div className="flex-1 min-h-0 overflow-y-auto p-3 rounded rounded-tl-none shadow-inner bg-admin-card-50">

                            {/* 圖片 */}
                            {activeTab === 'images' && (
                                <div className="flex flex-wrap justify-center gap-4 text-xs">
                                    {imageEntries.map(({ label, src }) => (
                                        <div key={label} className="flex flex-col w-40 gap-1">
                                            <p>{label}</p>
                                            <div className="w-40 h-[120px] bg-slate-200 flex items-center justify-center overflow-hidden rounded">
                                                {src ? (
                                                    <img src={src} alt={label} className="w-40 h-[120px] object-contain block" />
                                                ) : (
                                                    <p>無</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 內文 */}
                            {activeTab === 'content' && (
                                <div className="flex flex-col gap-4 text-sm">
                                    {focus.content && (
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-semibold text-slate-500">規格說明</p>
                                            <p className="whitespace-pre-wrap">{focus.content}</p>
                                        </div>
                                    )}
                                    {focus.description && (
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-semibold text-slate-500">描述</p>
                                            <p className="whitespace-pre-wrap">{focus.description}</p>
                                        </div>
                                    )}
                                    {focus.story && (
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-semibold text-slate-500">故事</p>
                                            <p className="whitespace-pre-wrap">{focus.story}</p>
                                        </div>
                                    )}
                                    {!focus.content && !focus.description && !focus.story && (
                                        <p className="text-xs text-admin-text-muted text-center py-6">無內文資料</p>
                                    )}
                                </div>
                            )}

                            {/* 養護重點 */}
                            {activeTab === 'care' && (
                                <div className="flex flex-col gap-3 text-sm">
                                    {care.length === 0 ? (
                                        <p className="text-xs text-admin-text-muted text-center py-6">無養護重點資料</p>
                                    ) : (
                                        care.map((tip, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <span className="text-xs font-bold text-admin-primary min-w-[36px] pt-0.5 shrink-0">
                                                    {CARE_LABELS[i] ?? `項目${i + 1}`}
                                                </span>
                                                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                                    {tip.title && <p className="font-semibold">{tip.title}</p>}
                                                    {tip.description && <p className="text-admin-text whitespace-pre-wrap">{tip.description}</p>}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* ── 操作按鈕 ── */}
                    <div className="flex justify-between shrink-0">
                        <button
                            type="button"
                            className="admin-btn-muted"
                            onClick={() => { setMod("update"); editProduct(focus); }}
                        >
                            編輯
                        </button>
                        <button
                            type="button"
                            className="admin-btn-primary"
                            onClick={() => setFocus({})}
                        >
                            關閉
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}

