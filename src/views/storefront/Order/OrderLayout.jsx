import { useState, useEffect, useCallback } from 'react';
import CartPage from './CartPage';
import ConfirmPage from './ConfirmPage';
import PaymentPage from './PaymentPage';
import CompletePage from './CompletePage';
import { getCart, updateCartItem, removeCartItem, clearCart, notifyCartUpdated, notifyToast } from '../../../api/cart';

/** 將 API 購物車格式轉成 CartPage / CartItem 使用的格式 */
function mapCartsToItems(apiData) {
    const carts = apiData?.data?.carts;
    if (!Array.isArray(carts)) return [];
    return carts.map((c) => ({
        id: c.id,
        product_id: c.product_id,
        name: c.product?.title ?? '',
        image: c.product?.imageUrl ?? null,
        price: c.product?.price ?? 0,
        quantity: c.qty ?? 0,
        stock: c.product?.stock ?? 999,
        unit: c.product?.unit ?? '',
        category: c.product?.category ?? '',
    }));
}

export default function OrderLayout() {
    const [step, setStep] = useState(0);
    const [orderConfirmData, setOrderConfirmData] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    /** 結帳當下快照的購物車品項，供完成頁顯示用（避免清空 API 後完成頁沒商品、金額為 0） */
    const [completedOrderItems, setCompletedOrderItems] = useState(null);
    const [cartLoading, setCartLoading] = useState(true);

    const fetchCart = useCallback(async () => {
        try {
            const res = await getCart();
            setCartItems(mapCartsToItems(res.data));
        } catch {
            setCartItems([]);
        } finally {
            setCartLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const updateQuantity = useCallback(async (cartItemId, delta) => {
        const item = cartItems.find((i) => i.id === cartItemId);
        if (!item) return;
        const maxQty = item.stock != null ? Number(item.stock) : 999;
        const newQty = Math.min(maxQty, Math.max(1, item.quantity + delta));
        if (newQty === item.quantity) return;
        try {
            await updateCartItem(cartItemId, item.product_id, newQty);
            notifyCartUpdated();
            const res = await getCart();
            setCartItems(mapCartsToItems(res.data));
        } catch (err) {
            const msg = err.response?.data?.message || '更新數量失敗';
            notifyToast(msg);
        }
    }, [cartItems]);

    const removeItem = useCallback(async (cartItemId) => {
        try {
            await removeCartItem(cartItemId);
            notifyCartUpdated();
            const res = await getCart();
            setCartItems(mapCartsToItems(res.data));
        } catch (err) {
            const msg = err.response?.data?.message || '刪除失敗';
            notifyToast(msg);
        }
    }, []);

    const stepsName = [
        '查看購物車',
        '填寫訂單資訊',
        '進行付款',
        '完成訂單',
    ];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    return (
        <div>
            {/*進度條*/}
            <div className="w-full bg-panel-50 flex flex-col md:flex-row justify-center md:items-center md:gap-2 p-4 ">

                {stepsName.map((name, i) => (
                    <span key={i} className="flex items-center gap-2 font-serif">
                        {i < stepsName.length && i > 0 && <span className="text-secondary hidden md:block">⮕</span>}
                        <button onClick={() => setStep(i)} disabled={step <= i}  className={`btn-steps ${step === i ? 'active text-lg md:text-sm font-bold' : ''}`} > 
                             {name}{step > i ? ' ✓' : '' }
                        </button>

                    </span>
                ))}
            </div>

            {
                step === 0 && (
                    <CartPage
                        cartItems={cartItems}
                        setStep={setStep}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                        cartLoading={cartLoading}
                    />
                )
            }
            {
                step === 1 && (
                <ConfirmPage
                    cartItems={cartItems}
                    setStep={setStep}
                    onConfirm={async (data) => {
                        setCompletedOrderItems([...cartItems]);
                        try {
                            await clearCart();
                        } catch {
                            notifyToast('訂單已送出，但清空購物車時發生錯誤');
                        }
                        setCartItems([]);
                        notifyCartUpdated();
                        setOrderConfirmData(data);
                        setStep(2);
                    }}
                />
            )
            }
            {
                step === 2 && <PaymentPage setStep={setStep} />
            }
            {
                step === 3 && (
                <CompletePage
                    cartItems={completedOrderItems ?? cartItems}
                    orderConfirmData={orderConfirmData}
                />
            )
            }

        </div>
    );
}