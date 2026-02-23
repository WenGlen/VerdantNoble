export default function FoucsPanel({ focus, setFocus, editProduct, setMod }) {
    return (
        <div className="h-screen bg-admin-card ">
            {!focus.id ? (
                <div className="h-screen w-[400px] flex-col-center  gap-2 overflow-x-auto p-4 bg-admin-card-focus">
                    <p className="text-center text-sm text-slate-600">
                        點擊「操作」按鈕，可查看或編輯產品詳細資訊
                        <br />
                        點擊「新增產品」按鈕，可新增產品
                    </p>
                </div>
            ) : (
                <div className="h-screen w-[400px] flex-col-between gap-2 overflow-x-auto p-4 bg-admin-card-focus">
                    <div className="h-fit w-full flex flex-col gap-4">
                        <div>
                            <h3 className="m-0 mb-2 text-slate-800">{focus.title}</h3>
                            <p className={`text-sm m-0 leading-6 ${focus.sub_title ? "font-semibold text-sky-600" : "text-slate-500"}`}>
                                {focus.sub_title || "無副標"}
                            </p>
                            <p className="text-sm text-slate-500 m-0 leading-6">{focus.content}</p>
                            <p className="text-sm m-0 leading-6">{focus.description}</p>
                        </div>
                        <div className="border-t border-slate-200 pt-3 flex justify-between items-end text-sm max-[640px]:flex-col max-[640px]:min-w-0 sm:min-w-[280px] sm:border-t-0 sm:border-l sm:border-slate-200 sm:pt-0 sm:pl-3">
                            <div className="w-[120px]">
                                <div className="flex justify-between py-0.5">
                                    <span>是否啟用：</span>
                                    <span>{focus.is_enabled ? "上架" : "隱藏"}</span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                    <span>原價：</span>
                                    <span>{focus.origin_price} 元</span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                    <span>折扣：</span>
                                    <span>{Math.round((focus.price / focus.origin_price) * 100)} %</span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                    <span>售價：</span>
                                    <span>{focus.price} 元</span>
                                </div>
                            </div>
                            <div className="w-[120px]">
                                <div className="flex justify-between py-0.5">
                                    <span>分類：</span>
                                    <span>{focus.category}</span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                    <span>已售數量：</span>
                                    <span>{focus.soldQuantity || 0} {focus.unit}</span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                    <span>庫存：</span>
                                    <span>{focus.stock} {focus.unit}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto overflow-x-auto flex flex-col p-2 rounded shadow-inner bg-admin-card-50">
                        <div className="flex flex-wrap justify-center gap-3 min-w-[340px] max-md:max-w-[540px] max-md:mx-auto [&_p]:m-0 [&_p]:text-xs">
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
                            className="inline-block rounded px-2 py-1 bg-sky-700 text-slate-100 border-none cursor-pointer hover:bg-sky-600"
                            onClick={() => { setMod("update"); editProduct(focus); }}
                        >
                            編輯
                        </button>
                        <button
                            type="button"
                            className="inline-block rounded px-2 py-1 bg-sky-700 text-slate-100 border-none cursor-pointer hover:bg-sky-600"
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
