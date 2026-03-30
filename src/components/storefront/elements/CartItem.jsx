import { useState } from "react";
import QuantityController from "./QuantityController";
import deleteIcon from "../../../img/delete.png";

function finiteNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export default function CartItem({ item, updateQuantity, removeItem }) {
  const price = finiteNumber(item?.price, 0);
  const quantity = finiteNumber(item?.quantity, 0);
  const stock = finiteNumber(item?.stock, 999);
  const isBoutique = item?.category === "精品";
  const maxQuantity = Math.max(1, stock);
  const unit = item?.unit;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleQuantityChange = (newValue) => {
    updateQuantity(item?.id, newValue - quantity);
  };

  const handleConfirmRemove = () => {
    removeItem(item?.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-[4fr_2fr_2fr_2fr_1fr] gap-2 md:gap-4 py-8 md:py-4 border-b border-border last:border-b-0 items-center">
        <div className="flex items-center gap-4 min-w-0 md:col-span-1">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-panel-50 flex items-center justify-center">
            {item?.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">🌿</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-md font-semibold text-default">
              {item?.name ?? ""}
            </h3>
            <p className="flex items-center gap-2 mt-0.5">
              {item?.variant != null && (
                <span className="text-xs font-semibold text-primary uppercase">
                  {item.variant}
                </span>
              )}
              {item?.subvariant != null && (
                <span className="text-xs text-muted uppercase">
                  {item.subvariant}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:contents px-4">
          <div className="flex items-center justify-between md:contents">
            <span className="text-sm text-muted md:text-center md:justify-self-center">
              ${price.toLocaleString()}
            </span>
          </div>
          <span className="text-sm text-muted block md:hidden">×</span>

          {isBoutique ? (
            <span className="text-sm font-semibold w-[120px] text-center">
              1
            </span>
          ) : (
            <QuantityController
              value={quantity}
              min={1}
              max={maxQuantity}
              unit={unit}
              onChange={handleQuantityChange}
              onRequestRemove={() => setShowDeleteConfirm(true)}
              className="md:justify-self-center"
            />
          )}

          <span className="text-sm text-muted block md:hidden">=</span>
          <div className="flex items-center justify-between md:contents">
            <span className="text-base font-bold text-default md:text-center md:justify-self-center">
              ${(price * quantity).toLocaleString()}
            </span>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="btn-icon"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="刪除此商品"
            >
              <img src={deleteIcon} alt="從購物車移除" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 刪除確認彈窗 */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowDeleteConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div
            className="bg-background rounded-lg shadow-lg p-6 max-w-sm mx-4 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="delete-dialog-title" className="text-default font-semibold">
              是否刪除此商品？
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleConfirmRemove}
              >
                確認刪除
              </button>
              <button
                type="button"
                className="btn-panel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
