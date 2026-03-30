import React from "react";
import CartItem from "../../../components/storefront/elements/CartItem";
import PageTitle from "../../../components/storefront/elements/PageTitle";

export default function CartPage({
  cartItems = [],
  setStep,
  updateQuantity: updateQuantityProp,
  removeItem: removeItemProp,
  cartLoading = false,
}) {
  const items = Array.isArray(cartItems) ? cartItems : [];

  const updateQuantity = updateQuantityProp ?? (() => {});
  const removeItem = removeItemProp ?? (() => {});

  return (
    <>
      <section className="w-full p-8 max-w-screen-md space-y-8">
        <PageTitle title="購物車" mobile="hidden" />

        {cartLoading ? (
          <p className="text-muted text-center">載入購物車中…</p>
        ) : items.length === 0 ? (
          <p className="text-muted text-center">
            購物車是空的，快去挑選商品吧。
          </p>
        ) : (
          <div className="w-full">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[4fr_2fr_2fr_2fr_1fr] gap-4 px-0 pb-2 border-b border-border-50 text-sm text-muted text-center">
              <span>商品</span>
              <span>單價</span>
              <span>數量</span>
              <span>小計</span>
              <span>操作</span>
            </div>

            {/* Items */}
            {items.map((item) => (
              <div key={item?.id} className="border-b border-border-50">
                <CartItem
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              </div>
            ))}
            <div className="grid grid-cols-[1fr_4fr] text-sm text-muted items-center px-8">
              <span className="">總計</span>
              <span className="text-lg font-bold text-primary text-right">
                $NT{" "}
                {items
                  .reduce((acc, item) => acc + item.price * item.quantity, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className="w-full text-right">
          <button
            type="button"
            className="btn-primary w-full md:w-auto"
            disabled={cartLoading || items.length === 0}
            onClick={() => setStep(1)}
          >
            前往結帳
          </button>
        </div>
      </section>
    </>
  );
}
