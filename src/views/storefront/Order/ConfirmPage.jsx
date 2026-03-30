import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import OrderSummary from "../../../components/storefront/sections/Order/OrderSummary";
import FormInput, {
  FormTextarea,
} from "../../../components/storefront/elements/FormInput";
import PageTitle from "../../../components/storefront/elements/PageTitle";
import { applyCouponCode as applyCouponApi } from "../../../api/coupons";
import { getCart } from "../../../api/cart";
import { resolveCouponApplyDisplayWithCartSync } from "../../../utils/couponNormalize";
import { showStorefrontToast } from "../../../slices/StorefrontToastSlice";
import { fetchCart } from "../../../slices/cartSlice";

export default function ConfirmPage({ cartItems, setStep, onConfirm }) {
  const dispatch = useDispatch();

  //暫時用會員登錄
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [useDefaultShippingInfo, setUseDefaultShippingInfo] = useState(false);
  const [useDefaultPaymentInfo, setUseDefaultPaymentInfo] = useState(false);

  /** 小計（未含運費、折扣），用於滿額免運、貨到付款門檻與 OrderSummary */
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const FREE_SHIPPING_THRESHOLD = 2000;
  const DEFAULT_FREIGHT = 120;
  /** 貨到付款僅適用於小計 2000 元以下（與免運門檻相同） */
  const isCashOnDeliveryAvailable = subtotal < FREE_SHIPPING_THRESHOLD;

  /** 折扣碼折抵金額（元）：套用成功後由「目前購物車小計 − API 回傳 final_total」推算；比例／定額說明以前台顯示輔助＋後端 final_total 為準 */
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  /** 成功套用後顯示在折扣碼欄位下方的單行說明（null 表示尚未套用成功） */
  const [appliedCouponSummaryLine, setAppliedCouponSummaryLine] =
    useState(null);

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    type: "信用卡",
    account: "",
    expiryDate: "",
    CVV: "",
    cardHolderName: "",
  });
  const [shippingInfo, setShippingInfo] = useState({
    type: "宅配",
    name: "",
    phone: "",
    address: "",
    pickupTime: "",
    message: "",
  });

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    defaultValues: {
      orderer: { name: "", phone: "", email: "" },
      payment: { account: "", expiryDate: "", CVV: "", cardHolderName: "" },
      shipping: {
        name: "",
        phone: "",
        address: "",
        message: "",
        pickupTime: "",
      },
    },
    mode: "onTouched",
  });

  /** 到店取貨免運費；宅配則依滿額免運門檻計算 */
  const freight =
    shippingInfo.type === "到店取貨"
      ? 0
      : subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : DEFAULT_FREIGHT;

  const defaultUserInfo = {
    name: "綠先生",
    phone: "0987654321",
    email: "green@gmail.com",
  };

  const defaultPaymentInfo = {
    type: "信用卡",
    account: "1234567890123456",
    expiryDate: "12 / 26",
    CVV: "123（正常來說不會存啦，這邊只是方便填寫）",
    cardHolderName: "綠黃藍",
  };

  const defaultShippingInfo = {
    type: "宅配",
    name: "綠先生的店",
    phone: "0987654321",
    address: "台北市大安區忠孝東路四段100號",
    pickupTime: "",
    message: "",
  };

  /** 卡號顯示用：每四位加一個空格（不影響實際儲存值） */
  function formatCardNumber(digitsOnly) {
    return digitsOnly
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  /** 取貨日可選範圍：隔天起 7 天內，且不可為週四 */
  const WEEKDAY_NAMES = ["日", "一", "二", "三", "四", "五", "六"];
  const THURSDAY = 4;
  function getValidPickupDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() === THURSDAY) continue;
      const y = d.getFullYear(),
        m = d.getMonth(),
        day = d.getDate();
      const value = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      dates.push({
        value,
        label: `${m + 1}/${day} (週${WEEKDAY_NAMES[d.getDay()]})`,
      });
    }
    return dates;
  }
  const validPickupDates = getValidPickupDates();

  /** 切換到「到店取貨」時重新驗證地址；切換到「宅配」時重新驗證取貨日 */
  useEffect(() => {
    if (shippingInfo.type === "到店取貨") trigger("shipping.address");
    else trigger("shipping.pickupTime");
  }, [shippingInfo.type, trigger]);

  /** 切換到「貨到付款」時清除信用卡欄位錯誤 */
  useEffect(() => {
    if (paymentInfo.type === "貨到付款") {
      trigger("payment.account");
      trigger("payment.expiryDate");
      trigger("payment.CVV");
      trigger("payment.cardHolderName");
    }
  }, [paymentInfo.type, trigger]);

  /** 小計滿 2000 時若已選貨到付款，自動改為信用卡 */
  useEffect(() => {
    if (!isCashOnDeliveryAvailable && paymentInfo.type === "貨到付款") {
      queueMicrotask(() =>
        setPaymentInfo((prev) => ({ ...prev, type: "信用卡" })),
      );
    }
  }, [isCashOnDeliveryAvailable, paymentInfo.type]);

  /** 訂購資訊、付款（信用卡時）、收件資訊由 React Hook Form 驗證 */
  const hasOrdererErrors = !!(
    errors.orderer?.name ||
    errors.orderer?.phone ||
    errors.orderer?.email
  );
  const isOrderersInfoValid = !hasOrdererErrors;

  const hasPaymentErrors = !!(
    errors.payment?.account ||
    errors.payment?.expiryDate ||
    errors.payment?.CVV ||
    errors.payment?.cardHolderName
  );
  const isPaymentInfoValid =
    paymentInfo.type === "貨到付款" ||
    (paymentInfo.type === "信用卡" && !hasPaymentErrors);

  const hasShippingErrors = !!(
    errors.shipping?.name ||
    errors.shipping?.phone ||
    errors.shipping?.address ||
    errors.shipping?.pickupTime
  );
  const isShippingInfoValid = !hasShippingErrors;

  const isFormValid =
    isOrderersInfoValid && isPaymentInfoValid && isShippingInfoValid;

  /** 未填寫完整的段落名稱，用於提示 */
  const invalidSections = [];
  if (!isOrderersInfoValid) invalidSections.push("訂購資訊");
  if (!isPaymentInfoValid) invalidSections.push("付款資訊");
  if (!isShippingInfoValid) invalidSections.push("收件資訊");

  function handleSubmit(e) {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    rhfHandleSubmit((data) => {
      if (!isOrderersInfoValid || !isPaymentInfoValid || !isShippingInfoValid)
        return;
      const fullShippingInfo = {
        ...data.shipping,
        type: shippingInfo.type,
      };
      const orderersInfoFromForm = data.orderer;
      if (onConfirm) {
        onConfirm({
          orderersInfo: orderersInfoFromForm,
          shippingInfo: fullShippingInfo,
          freight,
          appliedDiscount,
        });
      } else {
        setStep(2);
      }
    })(e);
  }

  /** POST /coupon 後再 GET /cart，以伺服器 total／final_total 與 coupon 物件對齊折抵（定額券必須與購物車狀態一致） */
  async function applyDiscountCode() {
    const code = discountCodeInput.trim();
    if (!code) {
      dispatch(showStorefrontToast("請輸入折扣碼"));
      setAppliedDiscount(0);
      setAppliedCouponSummaryLine(null);
      return;
    }
    try {
      const res = await applyCouponApi(code);
      if (res.data?.success) {
        let cartRes = null;
        try {
          cartRes = await getCart();
        } catch {
          cartRes = null;
        }
        const postPayload =
          res.data?.data != null && typeof res.data.data === "object"
            ? res.data.data
            : res.data;
        const display = resolveCouponApplyDisplayWithCartSync(
          subtotal,
          postPayload,
          cartRes,
        );
        if (!display) {
          setAppliedDiscount(0);
          setAppliedCouponSummaryLine(null);
          dispatch(showStorefrontToast("回傳資料異常，無法套用"));
          return;
        }
        try {
          await dispatch(fetchCart()).unwrap();
        } catch {
          /* 仍顯示折抵，唯購物車列可能與伺服器短暫不同步 */
        }
        setAppliedDiscount(display.discountAmount);
        const summaryParts = [
          `已套用，折抵 NT$ ${display.discountAmount.toLocaleString("zh-TW")}`,
        ];
        if (display.ruleShortLabel) {
          summaryParts.push(`（${display.ruleShortLabel}）`);
        }
        setAppliedCouponSummaryLine(summaryParts.join(""));
        dispatch(
          showStorefrontToast(
            res.data.message ||
              `已套用優惠券，折抵 NT$ ${display.discountAmount.toLocaleString("zh-TW")}`,
          ),
        );
      } else {
        setAppliedDiscount(0);
        setAppliedCouponSummaryLine(null);
        dispatch(showStorefrontToast(res.data?.message || "無法套用折扣碼"));
      }
    } catch (err) {
      setAppliedDiscount(0);
      setAppliedCouponSummaryLine(null);
      dispatch(
        showStorefrontToast(
          err.response?.data?.message || err.message || "套用失敗",
        ),
      );
    }
  }

  function applyDefaultPaymentInfo() {
    const next = !useDefaultPaymentInfo;
    setUseDefaultPaymentInfo(next);
    if (next) {
      const accountDigits = defaultPaymentInfo.account
        .replace(/\D/g, "")
        .slice(0, 16);
      setPaymentInfo({ ...defaultPaymentInfo, account: accountDigits });
      setValue("payment", {
        account: accountDigits,
        expiryDate: defaultPaymentInfo.expiryDate,
        CVV: defaultPaymentInfo.CVV,
        cardHolderName: defaultPaymentInfo.cardHolderName,
      });
    }
  }

  function applyDefaultShippingInfo() {
    const next = !useDefaultShippingInfo;
    setUseDefaultShippingInfo(next);
    if (next) {
      setShippingInfo({ ...defaultShippingInfo });
      setValue("shipping", {
        name: defaultShippingInfo.name,
        phone: defaultShippingInfo.phone,
        address: defaultShippingInfo.address,
        message: defaultShippingInfo.message || "",
        pickupTime: defaultShippingInfo.pickupTime || "",
      });
    }
  }

  return (
    <>
      <div
        className="w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-0 lg:gap-8" /* container */
      >
        <section className="w-full p-4 lg:p-8 max-w-screen-md space-y-8">
          <PageTitle title="訂單資訊" mobile="hidden" />

          <form className="flex flex-col" onSubmit={handleSubmit}>
            {/* 訂購資訊 */}
            <div className="w-full border-b border-border-50 py-12 space-y-4">
              <div className="flex gap-2 items-center lg:gap-8 justify-between">
                <h3 className="text-lg font-bold">訂購資訊</h3>
                <div className="hidden lg:block text-xs text-gray-500 w-[300px] text-right">
                  （實際會員登入功能還沒做，
                  <br />
                  先做個帶做預設資料的按鈕）
                </div>
                <button
                  type="button"
                  className="btn-primary text-xs "
                  disabled={isLoggedIn}
                  onClick={() => {
                    setIsLoggedIn(true);
                    setValue("orderer", defaultUserInfo);
                    applyDefaultPaymentInfo();
                    applyDefaultShippingInfo();
                  }}
                >
                  {isLoggedIn ? "已登入" : "登入會員自動帶入資訊"}
                </button>
              </div>

              <div className="flex flex-col gap-4 xl:flex-row xl:gap-8">
                <FormInput
                  label="訂購人姓名"
                  disabled={isLoggedIn}
                  placeholder="請輸入訂購人姓名"
                  error={errors.orderer?.name?.message}
                  {...register("orderer.name", {
                    required: "訂購人姓名為必填",
                  })}
                />
                <FormInput
                  label="訂購人電話"
                  type="tel"
                  disabled={isLoggedIn}
                  placeholder="請輸入訂購人電話"
                  error={errors.orderer?.phone?.message}
                  {...register("orderer.phone", {
                    required: "訂購人電話為必填",
                    minLength: { value: 9, message: "電話請超過 8 碼" },
                    pattern: { value: /^\d+$/, message: "電話請輸入數字" },
                  })}
                />
              </div>
              <FormInput
                label="會員 Email"
                type="email"
                disabled={isLoggedIn}
                placeholder="請輸入訂購人 Email"
                error={errors.orderer?.email?.message}
                {...register("orderer.email", {
                  required: "Email 為必填",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "請輸入有效的 Email 格式",
                  },
                })}
              />
            </div>

            {/* 付款資訊 */}
            <div className="w-full border-b border-border-50 py-12 space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
                <h3 className="text-lg font-bold">付款資訊</h3>
                {isLoggedIn && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="useDefaultPaymentInfo"
                      className="w-5 h-5"
                      checked={useDefaultPaymentInfo}
                      onChange={applyDefaultPaymentInfo}
                    />
                    <label htmlFor="useDefaultPaymentInfo" className="text-sm">
                      使用預設付款資料
                    </label>
                  </div>
                )}
              </div>

              <div className="w-full lg:w-fit flex rounded-md overflow-hidden gap-0 sm:gap-0">
                <button
                  type="button"
                  className={`btn-segmented flex-1 sm:flex-initial ${paymentInfo.type === "信用卡" ? "active" : ""}`}
                  onClick={() =>
                    setPaymentInfo((prev) => ({ ...prev, type: "信用卡" }))
                  }
                >
                  信用卡
                </button>
                <button
                  type="button"
                  className={`btn-segmented flex-1 sm:flex-initial ${paymentInfo.type === "貨到付款" ? "active" : ""}`}
                  disabled={!isCashOnDeliveryAvailable}
                  onClick={() =>
                    setPaymentInfo((prev) => ({ ...prev, type: "貨到付款" }))
                  }
                >
                  貨到付款
                  <br className="block lg:hidden " />
                  （2000元以下適用）
                </button>
              </div>
              {paymentInfo.type === "信用卡" ? (
                <>
                  <FormInput
                    label="信用卡卡號"
                    disabled={useDefaultPaymentInfo}
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={formatCardNumber(paymentInfo.account)}
                    error={errors.payment?.account?.message}
                    {...register("payment.account", {
                      validate: (v) => {
                        if (paymentInfo.type !== "信用卡") return true;
                        const digits = (v || "").replace(/\D/g, "").trim();
                        return digits.length === 16 || "請輸入 16 碼信用卡卡號";
                      },
                    })}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16);
                      setPaymentInfo((prev) => ({ ...prev, account: digits }));
                      setValue("payment.account", digits);
                    }}
                  />

                  <div className="flex flex-col gap-4 xl:flex-row xl:gap-8">
                    <FormInput
                      label="到期日"
                      disabled={useDefaultPaymentInfo}
                      placeholder="MM / YY"
                      error={errors.payment?.expiryDate?.message}
                      {...register("payment.expiryDate", {
                        validate: () => {
                          if (paymentInfo.type !== "信用卡") return true;
                          const val = (paymentInfo.expiryDate ?? "")
                            .toString()
                            .trim();
                          return val.length > 0 || "請輸入到期日（有填即可）";
                        },
                      })}
                      onChange={(e) => {
                        setPaymentInfo((prev) => ({
                          ...prev,
                          expiryDate: e.target.value,
                        }));
                        setValue("payment.expiryDate", e.target.value);
                      }}
                      value={paymentInfo.expiryDate}
                    />
                    <FormInput
                      label="CVV"
                      disabled={useDefaultPaymentInfo}
                      placeholder="xxx"
                      error={errors.payment?.CVV?.message}
                      {...register("payment.CVV", {
                        validate: () => {
                          if (paymentInfo.type !== "信用卡") return true;
                          const val = (paymentInfo.CVV ?? "").toString().trim();
                          return val.length > 0 || "請輸入 CVV（有填即可）";
                        },
                      })}
                      onChange={(e) => {
                        setPaymentInfo((prev) => ({
                          ...prev,
                          CVV: e.target.value,
                        }));
                        setValue("payment.CVV", e.target.value);
                      }}
                      value={paymentInfo.CVV}
                    />
                  </div>

                  <FormInput
                    label="持卡人姓名"
                    disabled={useDefaultPaymentInfo}
                    placeholder="請輸入持卡人姓名"
                    error={errors.payment?.cardHolderName?.message}
                    {...register("payment.cardHolderName", {
                      validate: () => {
                        if (paymentInfo.type !== "信用卡") return true;
                        const val = (paymentInfo.cardHolderName ?? "")
                          .toString()
                          .trim();
                        return val.length > 0 || "請輸入持卡人姓名（有填即可）";
                      },
                    })}
                    onChange={(e) => {
                      setPaymentInfo((prev) => ({
                        ...prev,
                        cardHolderName: e.target.value,
                      }));
                      setValue("payment.cardHolderName", e.target.value);
                    }}
                    value={paymentInfo.cardHolderName}
                  />
                </>
              ) : (
                <>
                  <p className="text-sm text-muted">
                    貨到付款適用於折價前總金額為2000元以下訂單
                  </p>
                </>
              )}
            </div>

            {/* 收件資訊 */}
            <div className="w-full border-b border-border-50 py-12 space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
                <h3 className="text-lg font-bold">收件資訊</h3>
                {isLoggedIn && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="useDefaultShippingInfo"
                      className="w-5 h-5"
                      checked={useDefaultShippingInfo}
                      onChange={applyDefaultShippingInfo}
                    />
                    <label htmlFor="useDefaultShippingInfo" className="text-sm">
                      使用預設收件資料
                    </label>
                  </div>
                )}
              </div>

              <div className="w-full lg:w-fit flex rounded-md overflow-hidden gap-0 sm:gap-0">
                <button
                  type="button"
                  className={`btn-segmented flex-1 sm:flex-initial ${shippingInfo.type === "宅配" ? "active" : ""}`}
                  onClick={() =>
                    setShippingInfo((prev) => ({ ...prev, type: "宅配" }))
                  }
                >
                  宅配
                </button>
                <button
                  type="button"
                  className={`btn-segmented flex-1 sm:flex-initial ${shippingInfo.type === "到店取貨" ? "active" : ""}`}
                  onClick={() =>
                    setShippingInfo((prev) => ({ ...prev, type: "到店取貨" }))
                  }
                >
                  到店取貨
                </button>
              </div>

              <div className="flex flex-col gap-4 xl:flex-row xl:gap-8">
                <FormInput
                  label="收件人姓名"
                  disabled={useDefaultShippingInfo}
                  placeholder="請輸入收件人姓名"
                  error={errors.shipping?.name?.message}
                  {...register("shipping.name", { required: "姓名為必填" })}
                />
                <FormInput
                  label="收件人電話"
                  type="tel"
                  disabled={useDefaultShippingInfo}
                  placeholder="請輸入收件人電話"
                  error={errors.shipping?.phone?.message}
                  {...register("shipping.phone", {
                    required: "電話為必填",
                    minLength: { value: 9, message: "電話請超過 8 碼" },
                    pattern: { value: /^\d+$/, message: "電話請輸入數字" },
                  })}
                />
              </div>
              {shippingInfo.type === "宅配" ? (
                <>
                  <FormInput
                    label="收件地址"
                    disabled={useDefaultShippingInfo}
                    placeholder="請輸入收件地址"
                    error={errors.shipping?.address?.message}
                    {...register("shipping.address", {
                      required:
                        shippingInfo.type === "宅配" ? "地址為必填" : false,
                      validate: (value) => {
                        if (shippingInfo.type !== "宅配") return true;
                        return value?.trim()?.length > 0 || "地址為必填";
                      },
                    })}
                  />
                  <FormTextarea
                    label="留言"
                    disabled={useDefaultShippingInfo}
                    placeholder="選填，如有備註可在此填寫"
                    error={errors.shipping?.message?.message}
                    {...register("shipping.message")}
                  />
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-2">
                    <label className="flex flex-col gap-1 lg:flex-row lg:items-start lg:gap-2">
                      <span className="form-label pt-2">預計取貨日</span>
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <select
                          className="w-full lg:w-[200px] min-w-0"
                          {...register("shipping.pickupTime", {
                            validate: (v) => {
                              if (shippingInfo.type !== "到店取貨") return true;
                              // 只要不是「請選擇取貨日」（空值），選任一日期即可
                              return (v && v.trim() !== "") || "請選擇取貨日";
                            },
                          })}
                        >
                          <option value="">請選擇取貨日</option>
                          {validPickupDates.map((d) => (
                            <option key={d.value} value={d.value}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                        {errors.shipping?.pickupTime?.message && (
                          <span className="text-sm text-error" role="alert">
                            {errors.shipping.pickupTime.message}
                          </span>
                        )}
                      </div>
                    </label>
                    <p className="text-xs text-muted lg:w-[300px] ml-2">
                      取貨日為隔天起 7 日內（週四不營業）
                      <br />
                      請於 11:00–21:00 到店取貨
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    <span className="form-label">綠蕨飾店址</span>
                    <p className="text-sm text-muted">
                      台北市大安區忠孝東路四段100號
                    </p>
                  </div>

                  <FormTextarea
                    label="留言"
                    disabled={useDefaultShippingInfo}
                    placeholder="選填，如有備註可在此填寫"
                    {...register("shipping.message")}
                  />
                </>
              )}
            </div>

            <div className="w-full border-b border-border-50 py-12 space-y-4">
              <h3 className="text-lg font-bold">折扣優惠</h3>

              {/* 優惠說明：滿 2000 免運 */}
              <div className="rounded-md bg-panel-50 p-4 space-y-1">
                {freight === 0 ? (
                  <p className="text-xs">
                    小計 $NT ${subtotal.toLocaleString()}，已達 2000
                    元免運門檻。
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      若滿 $NT 2,000 即享免運費
                    </p>
                    <p className="text-xs text-muted">
                      小計 $NT ${subtotal.toLocaleString()}，還差 $NT $
                      {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()}{" "}
                      即享免運。
                    </p>
                  </>
                )}
              </div>

              {/* 折扣碼 */}
              <div className="flex flex-col gap-1 w-full">
                <label className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
                  <span className="form-label">折扣碼</span>
                  <div className="w-full flex gap-2">
                    <input
                      type="text"
                      className="flex-1 min-w-0"
                      value={discountCodeInput}
                      onChange={(e) => setDiscountCodeInput(e.target.value)}
                      placeholder="請輸入折扣碼"
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={applyDiscountCode}
                    >
                      套用
                    </button>
                  </div>
                </label>
                <p className="text-xs text-muted m-0">
                  每筆訂單只能使用一次折扣碼。
                </p>
                {appliedCouponSummaryLine ? (
                  <p className="text-sm text-primary m-0">
                    {appliedCouponSummaryLine}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="py-8 block lg:hidden">
              <div className="bg-panel-50 p-4 rounded-md space-y-8 sticky top-4">
                <h3 className="text-lg font-bold">訂單內容</h3>
                <OrderSummary
                  items={cartItems}
                  freight={freight}
                  discount={appliedDiscount}
                />
              </div>
            </div>

            {/* 送出訂單按鈕 */}
            <div className="w-full py-6 lg:py-12 flex flex-col lg:flex-row items-center justify-end gap-2 lg:gap-4">
              {hasAttemptedSubmit &&
                !isFormValid &&
                invalidSections.length > 0 && (
                  <span
                    className="text-sm text-error w-full lg:w-auto lg:mr-auto"
                    role="alert"
                  >
                    請填寫完：{invalidSections.join("、")}
                  </span>
                )}
              <button type="submit" className="btn-primary w-full lg:w-auto">
                送出訂單
              </button>
            </div>
          </form>
        </section>

        <aside className="py-28 pr-8 hidden lg:block">
          <div className="w-[400px] bg-panel-50 p-4 rounded-md space-y-8">
            <h3 className="text-lg font-bold">訂單內容</h3>
            <OrderSummary
              items={cartItems}
              freight={freight}
              discount={appliedDiscount}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
