import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
const { VITE_API_URL, VITE_API_PATH } = import.meta.env;
import deleteIcon from '../../../img/delete.png';

import { createAsyncDashboardToast } from '../../../slices/DashboardToastSlice';

const MAX_FEATURED = 4;

export default function ProductsMark() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    // featuredOrder：依序排列的商品 ID，index 0 = 第1位，最多 MAX_FEATURED 筆
    const [featuredOrder, setFeaturedOrder] = useState([]);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/products/all`);
            if (res.data.products) {
                const list = Object.values(res.data.products).map(p => ({
                    ...p,
                    // 相容舊的 boolean 格式（true → 1）與新的 number 格式
                    is_featured: typeof p.is_featured === 'number'
                        ? p.is_featured
                        : (p.is_featured === true ? 1 : 0),
                }));
                list.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'zh-TW'));
                setProducts(list);

                // 從現有資料還原排序
                const order = list
                    .filter(p => p.is_featured >= 1)
                    .sort((a, b) => a.is_featured - b.is_featured)
                    .map(p => p.id);
                setFeaturedOrder(order);
            }
        } catch {
            dispatch(createAsyncDashboardToast({ message: "取得商品列表失敗", success: false }));
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // ── 計算是否有未儲存的變更 ──────────────────────────────
    const hasChanges = products.some(p => {
        const saved = p.is_featured || 0;
        const current = featuredOrder.indexOf(p.id) + 1; // 0 if not found
        return saved !== current;
    });

    // ── 勾選 / 取消勾選下方商品 ─────────────────────────────
    function toggleProduct(product) {
        const idx = featuredOrder.indexOf(product.id);
        if (idx !== -1) {
            setFeaturedOrder(prev => prev.filter(id => id !== product.id));
        } else {
            if (featuredOrder.length >= MAX_FEATURED) {
                dispatch(createAsyncDashboardToast({
                    message: `已達上限（${MAX_FEATURED} 個），請先移除排序中的商品`,
                    success: false,
                }));
                return;
            }
            setFeaturedOrder(prev => [...prev, product.id]);
        }
    }

    // ── 上方排序區：上移 / 下移 / 移除 ──────────────────────
    function moveUp(index) {
        if (index === 0) return;
        setFeaturedOrder(prev => {
            const next = [...prev];
            [next[index - 1], next[index]] = [next[index], next[index - 1]];
            return next;
        });
    }

    function moveDown(index) {
        if (index === featuredOrder.length - 1) return;
        setFeaturedOrder(prev => {
            const next = [...prev];
            [next[index], next[index + 1]] = [next[index + 1], next[index]];
            return next;
        });
    }

    function removeFromOrder(index) {
        setFeaturedOrder(prev => prev.filter((_, i) => i !== index));
    }

    // ── 儲存 ────────────────────────────────────────────────
    async function saveChanges() {
        setSaving(true);
        try {
            const toUpdate = products.filter(p => {
                const saved = p.is_featured || 0;
                const current = featuredOrder.indexOf(p.id) + 1;
                return saved !== current;
            });

            for (const product of toUpdate) {
                const newVal = featuredOrder.indexOf(product.id) + 1; // 0 if not in order
                const imagesUrl = (product.imagesUrl || []).filter(u => u?.trim() !== "");
                await axios.put(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/product/${product.id}`, {
                    data: {
                        title: product.title,
                        sub_title: product.sub_title || "",
                        category: product.category || "",
                        origin_price: product.origin_price || 0,
                        price: product.price || 0,
                        unit: product.unit || "",
                        description: product.description || "",
                        content: product.content || "",
                        is_enabled: product.is_enabled,
                        is_featured: newVal,
                        updated_at: product.updated_at || "",
                        stock: product.stock || 0,
                        soldQuantity: product.soldQuantity || 0,
                        imageUrl: product.imageUrl || "",
                        imagesUrl,
                    },
                });
            }

            // 同步本地 products 的 is_featured
            setProducts(prev => prev.map(p => ({
                ...p,
                is_featured: featuredOrder.indexOf(p.id) + 1,
            })));

            dispatch(createAsyncDashboardToast({ message: "精選排序已儲存", success: true }));
        } catch {
            dispatch(createAsyncDashboardToast({ message: "儲存失敗，請稍後再試", success: false }));
        } finally {
            setSaving(false);
        }
    }

    const productMap = Object.fromEntries(products.map(p => [p.id, p]));

    // ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-80 h-[300px] p-3 flex flex-col gap-6 justify-center items-center rounded-lg bg-admin-card-50 shadow-md">
                    <Oval height={80} width={80} color="var(--color-admin-text-hover)" secondaryColor="var(--color-admin-bg)" strokeWidth={6} />
                    <p className="text-sm text-center">資料讀取中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col px-8 pt-8 pb-4 max-w-4xl mx-auto overflow-hidden">

            {/* ── 標題列 ── */}
            <div className="flex items-start justify-between mb-4 shrink-0">
                <div>
                    <h2 className="text-admin-text">精選商品管理</h2>
                    <p className="text-sm text-admin-text-muted mt-1">
                        在下方勾選商品加入精選，最多 {MAX_FEATURED} 個，可在上方調整顯示順序
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        className="admin-btn-muted"
                        onClick={loadProducts}
                        disabled={saving}
                    >
                        重新整理
                    </button>
                    <button
                        type="button"
                        className="admin-btn-primary"
                        onClick={saveChanges}
                        disabled={!hasChanges || saving}
                    >
                        {saving ? "儲存中..." : "儲存排序"}
                    </button>
                </div>
            </div>

            {/* ── 排序區 ── */}
            <div className="w-full flex-row-between-center gap-2">
                <h3>首頁顯示順序（{featuredOrder.length} / {MAX_FEATURED}）</h3>
                {hasChanges && <span className="ml-2 text-error">有未儲存的變更</span>}
            </div>
            <div className="shrink-0 mb-4 p-3 rounded-lg bg-admin-card">

                <div className="flex flex-col gap-1.5">
                    {Array.from({ length: MAX_FEATURED }, (_, i) => {
                        const pid = featuredOrder[i];
                        const product = pid ? productMap[pid] : null;
                        return (
                            <div key={i}
                                className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors
                                            ${product ? "bg-admin-card-edit" : "bg-admin-card-50"}`}>
                                <span className={`font-bold w-4 shrink-0`}>
                                    {i + 1}
                                </span>
                                {product ? (
                                    <>
                                        <div className="w-12 h-12 shrink-0 rounded overflow-hidden bg-admin-card-50">
                                            {product.imageUrl
                                                ? <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">🌿</div>
                                            }
                                        </div>
                                        <span className="flex-1 truncate font-semibold text-admin-text">{product.title}</span>
                                        <span className="text-admin-text-muted text-xs shrink-0">NT${product.price}</span>
                                        <div className="flex-row-center-center gap-4 shrink-0">
                                            <button type="button" className="admin-btn-icon"
                                                    onClick={() => moveUp(i)} disabled={i === 0} >
                                                ↑
                                            </button>
                                            <button type="button" className="admin-btn-icon"
                                                    onClick={() => moveDown(i)} disabled={i === featuredOrder.length - 1}>
                                                ↓
                                            </button>
                                            <button type="button" className="admin-btn-icon"
                                                    onClick={() => removeFromOrder(i)}>
                                                <img src={deleteIcon} alt="刪除" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <span className="">空位</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── 商品列表（可捲動） ── */}
            <div className="w-full flex-row-start-center gap-2">
            <h3>所有商品</h3>  <p className="text-sm text-admin-text-muted">（勾選加入精選）</p>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0">

                <div className="flex flex-col gap-1">
                    {products.filter(p => p.category === '精品').map(product => {
                        const isChecked = featuredOrder.includes(product.id);
                        const isAtMax = !isChecked && featuredOrder.length >= MAX_FEATURED;

                        return (
                            <label
                                key={product.id}
                                className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors
                                    ${isChecked
                                        ? "bg-admin-card-edit"
                                        : "bg-admin-card-50 hover:bg-admin-card-25"
                                    }
                                    ${isAtMax ? "opacity-40 cursor-not-allowed" : ""}
                                `}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    disabled={isAtMax}
                                    onChange={() => toggleProduct(product)}
                                    className="w-4 h-4 shrink-0 cursor-pointer accent-admin-primary"
                                />
                                <div className="w-12 h-12 shrink-0 overflow-hidden">
                                    {product.imageUrl
                                        ? <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center text-slate-400">🌿</div>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm text-admin-text truncate">{product.title}</p>
                                        {!product.is_enabled && (
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 shrink-0">未上架</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-admin-text-muted">NT${product.price}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
