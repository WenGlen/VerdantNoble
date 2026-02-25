


export default function FoucsPanel({ focus, setFocus, editProduct, setMod }) {

    const FocusPanelItem = ({ label, value, className }) => {
        return (
            <div className={`flex justify-between ${className}`}>
                <span>{label}</span>
                <span>{value}</span>
            </div>
        );
    };

    
    return (
        <div className="h-full flex justify-center items-center">
            {!focus.id ? (
                <div className="h-fit xl:h-screen w-[400px] flex-col-center  gap-2 overflow-x-auto p-4 bg-admin-card-focus tablet:rounded-md">
                    <p className="text-center text-sm text-slate-600">
                        點擊「操作」按鈕，可查看或編輯產品詳細資訊
                        <br />
                        點擊「新增產品」按鈕，可新增產品
                    </p>
                </div>
            ) : (
                <div className="h-fit xl:h-screen w-[600px] xl:w-[400px] flex-col-between gap-2 p-4 overflow-x-auto 
                                bg-admin-card-focus tablet:rounded-md">
                    <div className="h-fit w-full flex flex-col gap-2 py-4">
                        <div className="space-y-2 text-sm">
                            <h3 className="text-admin-text">{focus.title}</h3>
                            <p className={`${focus.sub_title ? "font-semibold text-admin-primary" : "text-admin-text-muted"}`}>
                                {focus.sub_title || "無副標"}
                            </p>
                            <p>{focus.content}</p>
                            <p>{focus.description}</p>
                        </div>
                        <div className="flex-row-center-center gap-8 text-sm">
                            <div className="w-[160px] space-y-1">
                                <FocusPanelItem label="是否啟用：" value={focus.is_enabled ? "上架" : "隱藏"} className="" />
                                <FocusPanelItem label="原價：" value={focus.origin_price} className="" />
                                <FocusPanelItem label="折扣：" value={Math.round((focus.price / focus.origin_price) * 100)} className="" />
                                <FocusPanelItem label="售價：" value={focus.price} className="" />
                            </div>
                            <div className="w-[1px] h-[100px] bg-admin-border"/>
                            <div className="w-[160px] space-y-1">
                                <FocusPanelItem label="上架時間：" value={focus.created_at} className="" />
                                <FocusPanelItem label="分類：" value={focus.category} className="" />
                                <FocusPanelItem label="已售數量：" value={focus.soldQuantity || 0} className="" />
                                <FocusPanelItem label="庫存：" value={focus.stock} className="" />
                            </div>
                        </div>
                    </div>
                    {/* 圖片區 */}
                    <div className="flex-1 overflow-y-auto flex flex-col p-2 rounded shadow-inner bg-admin-card-50">
                        <div className="flex flex-wrap justify-center gap-4 min-w-[340px] text-xs">
                            <div className="flex flex-col w-40 gap-1">
                                <p>主要圖片</p>
                                <div className="w-40 h-[120px] bg-slate-200 flex items-center justify-center object-contain">
                                    {focus.imageUrl && (
                                        <img src={focus.imageUrl} alt={focus.imageUrl} className="w-40 h-[120px] object-contain block" />
                                    )}
                                </div>
                            </div>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div key={num} className="flex flex-col w-40 gap-1">
                                    <p>圖片 {num}</p>
                                    <div className="w-40 h-[120px] bg-slate-200 flex items-center justify-center object-contain">
                                        {focus[`imageUrl${num}`] ? (
                                            <img src={focus[`imageUrl${num}`]} alt={focus[`imageUrl${num}`]} className="w-40 h-[120px] object-contain block" />
                                        ) : (
                                            <p>無</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between">
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
