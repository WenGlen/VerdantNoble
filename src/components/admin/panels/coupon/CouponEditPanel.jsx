import {
  COUPON_DISCOUNT_FIXED,
  COUPON_DISCOUNT_PERCENT,
} from "../../../../utils/couponNormalize";

export default function CouponEditPanel({
  form,
  setForm,
  mod,
  editingId,
  saving,
  onCancel,
  onSubmit,
}) {
  return (
    <form
      className="w-[600px] max-w-[calc(100vw-2rem)] xl:w-[400px] flex flex-col gap-3 p-4 bg-admin-card-edit tablet:rounded-md h-fit max-h-[90vh] overflow-y-auto xl:h-screen xl:max-h-none xl:overflow-hidden"
      onSubmit={onSubmit}
    >
      <div className="shrink-0 flex flex-col gap-2">
        <h2 className="text-sm font-bold text-admin-text m-0">
          {editingId ? "編輯優惠券" : "新增優惠券"}
        </h2>
      </div>

      <div className="flex flex-col max-xl:flex-none xl:flex-1 xl:min-h-0">
        <div className="p-2 flex flex-col gap-2 max-xl:shrink-0 xl:flex-1 xl:min-h-0 xl:overflow-y-auto">
          <div className="flex flex-row items-center gap-1">
            <label htmlFor="coupon-code" className="text-xs min-w-12 shrink-0">
              折扣碼
            </label>
            <input
              id="coupon-code"
              type="text"
              className="admin-edit-panel__input"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              placeholder="請輸入折扣碼"
              required
            />
          </div>
          <div className="flex flex-row items-center gap-1">
            <label htmlFor="coupon-title" className="text-xs min-w-12 shrink-0">
              標題
            </label>
            <input
              id="coupon-title"
              type="text"
              className="admin-edit-panel__input"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="請輸入標題"
              required
            />
          </div>
          <div className="flex flex-row items-center gap-1 flex-wrap">
            <span className="text-xs min-w-16 shrink-0 leading-tight">
              折扣方式
            </span>
            <div className="flex flex-row gap-1 flex-1 min-w-0">
              <button
                type="button"
                className={`btn-select px-2 py-1 text-xs whitespace-nowrap ${form.discount_type !== COUPON_DISCOUNT_FIXED ? "active" : ""}`}
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    discount_type: COUPON_DISCOUNT_PERCENT,
                  }))
                }
              >
                比例（％）
              </button>
              <button
                type="button"
                className={`btn-select px-2 py-1 text-xs whitespace-nowrap ${form.discount_type === COUPON_DISCOUNT_FIXED ? "active" : ""}`}
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    discount_type: COUPON_DISCOUNT_FIXED,
                  }))
                }
              >
                定額（元）
              </button>
            </div>
          </div>
          {form.discount_type === COUPON_DISCOUNT_PERCENT ? (
            <div className="flex flex-row items-center gap-1">
              <label
                htmlFor="coupon-percent"
                className="text-xs min-w-12 shrink-0 whitespace-nowrap"
              >
                比例
              </label>
              <div className="flex flex-row items-center gap-1 flex-1 min-w-0 flex-wrap">
                <input
                  id="coupon-percent"
                  type="number"
                  min={1}
                  max={100}
                  className="admin-edit-panel__input admin-edit-panel__input--coupon-percent"
                  value={form.percent}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, percent: e.target.value }))
                  }
                />
                <span className="ml-2 text-xs">％</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-1">
              <label
                htmlFor="coupon-fixed"
                className="text-xs min-w-12 shrink-0 whitespace-nowrap"
              >
                金額
              </label>
              <div className="flex flex-row items-center gap-1 flex-1 min-w-0 flex-wrap">
                <input
                  id="coupon-fixed"
                  type="number"
                  min={1}
                  step={1}
                  className="admin-edit-panel__input admin-edit-panel__input--coupon-fixed"
                  value={form.fixed_amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fixed_amount: e.target.value }))
                  }
                  placeholder=""
                />
                <span className="ml-2 text-xs">元</span>
              </div>
            </div>
          )}
          <div className="flex flex-row items-center gap-1">
            <label
              htmlFor="coupon-due"
              className="text-xs min-w-12 shrink-0 whitespace-nowrap"
            >
              到期
            </label>
            <input
              id="coupon-due"
              type="datetime-local"
              className="admin-edit-panel__input admin-edit-panel__input--datetime"
              value={form.due_date_local}
              onChange={(e) =>
                setForm((f) => ({ ...f, due_date_local: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex flex-row items-center gap-1">
            <label className="text-xs min-w-16 ">是否啟用</label>
            <button
              type="button"
              className={`btn-select px-2 py-1 whitespace-nowrap ${form.is_enabled === 1 ? "active" : ""}`}
              onClick={() => setForm((f) => ({ ...f, is_enabled: 1 }))}
            >
              上架
            </button>
            <button
              type="button"
              className={`btn-select px-2 py-1 whitespace-nowrap ${form.is_enabled === 1 ? "" : "active"}`}
              onClick={() => setForm((f) => ({ ...f, is_enabled: 0 }))}
            >
              隱藏
            </button>
          </div>
        </div>
      </div>

      <div className="shrink-0 [&_p]:m-0 [&_p]:mb-2">
        <div className="flex justify-between">
          <button
            type="button"
            className="admin-btn-muted"
            disabled={saving}
            onClick={onCancel}
          >
            {mod === "update" ? "取消編輯（不會儲存）" : "取消新增（不會儲存）"}
          </button>
          <button type="submit" className="admin-btn-primary" disabled={saving}>
            {saving
              ? editingId
                ? "更新優惠券中…"
                : "建立優惠券中…"
              : editingId
                ? "更新優惠券"
                : "建立優惠券"}
          </button>
        </div>
      </div>
    </form>
  );
}
