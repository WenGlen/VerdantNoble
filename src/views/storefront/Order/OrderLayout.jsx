import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartPage from "./CartPage";
import ConfirmPage from "./ConfirmPage";
import PaymentPage from "./PaymentPage";
import CompletePage from "./CompletePage";
import {
  selectCartItems,
  selectCartLoading,
  fetchCart,
  updateQuantity,
  removeItem,
  clearCart,
} from "../../../slices/cartSlice";
import { fetchProducts } from "../../../slices/productsSlice";

export default function OrderLayout() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartLoading = useSelector(selectCartLoading);

  const [step, setStep] = useState(0);
  const [orderConfirmData, setOrderConfirmData] = useState(null);
  /** 結帳當下快照的購物車品項，供完成頁顯示用（避免清空 API 後完成頁沒商品、金額為 0） */
  const [completedOrderItems, setCompletedOrderItems] = useState(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQuantity = (cartItemId, delta) => {
    dispatch(updateQuantity({ cartItemId, delta }));
  };

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeItem(cartItemId));
  };

  const stepsName = ["查看購物車", "填寫訂單資訊", "進行付款", "完成訂單"];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  return (
    <div>
      {/*進度條*/}
      <div className="w-full bg-panel-50 flex flex-col md:flex-row justify-center md:items-center md:gap-2 p-4 ">
        {stepsName.map((name, i) => (
          <span key={i} className="flex items-center gap-2 font-serif">
            {i < stepsName.length && i > 0 && (
              <span className="text-secondary hidden md:block">⮕</span>
            )}
            <button
              onClick={() => setStep(i)}
              disabled={step <= i}
              className={`btn-steps ${step === i ? "active text-lg md:text-sm font-bold" : ""}`}
            >
              {name}
              {step > i ? " ✓" : ""}
            </button>
          </span>
        ))}
      </div>

      {step === 0 && (
        <CartPage
          cartItems={cartItems}
          setStep={setStep}
          updateQuantity={handleUpdateQuantity}
          removeItem={handleRemoveItem}
          cartLoading={cartLoading}
        />
      )}
      {step === 1 && (
        <ConfirmPage
          cartItems={cartItems}
          setStep={setStep}
          onConfirm={async (data) => {
            setCompletedOrderItems([...cartItems]);
            await dispatch(clearCart());
            /*
             * 目前前台結帳流程仍未真正建立訂單／扣減庫存並寫入資料庫；此專案僅清購物車。
             * 正式網站會在訂單成立（常見為付款成功或後端確認單據後）重拉商品列表，讓庫存與列表與後端一致。
             * 此處在清空購物車後觸發 fetchProducts，即預留與正式站相同的「下單後刷新商品」行為。
             */
            dispatch(fetchProducts());
            setOrderConfirmData(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && <PaymentPage setStep={setStep} />}
      {step === 3 && (
        <CompletePage
          cartItems={completedOrderItems ?? cartItems}
          orderConfirmData={orderConfirmData}
        />
      )}
    </div>
  );
}
