import { useState, useCallback } from "react";
import FormInput from "../../../components/storefront/elements/FormInput";
import PageTitle from "../../../components/storefront/elements/PageTitle";

const SECTION_ORDERER = "orderer";
const SECTION_PAYMENT = "payment";
const SECTION_SHIPPING = "shipping";

function formatCardNumber(digitsOnly) {
  if (!digitsOnly) return "";
  return digitsOnly
    .replace(/\s/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function maskCardNumber(digitsOnly) {
  if (!digitsOnly || digitsOnly.length < 4) return "";
  return `**** **** **** ${digitsOnly.slice(-4)}`;
}

/**
 * 各欄位：
 * 檢視 = 純顯示列；
 * 編輯 = FormInput（readOnly 時一律只顯示，如綁定帳號的 Email）
 */
function InfoField({
  label,
  value,
  editing,
  onChange,
  placeholder,
  mask,
  readOnly,
}) {
  const display =
    value != null && value !== "" ? (mask ? mask(value) : value) : "—";
  const showDisplay = !editing || readOnly;

  if (showDisplay) {
    return (
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-8">
        <span className="form-label text-muted">{label}</span>
        <span className="text-default min-w-0">{display}</span>
      </div>
    );
  }
  return (
    <FormInput
      label={label}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

const initialOrderersInfo = {
  name: "綠先生",
  phone: "0987654321",
  email: "green@gmail.com",
};
const initialPaymentInfo = {
  type: "信用卡",
  account: "1234567890123456",
  expiryDate: "12 / 26",
  cardHolderName: "綠黃藍",
};
const initialShippingInfo = {
  type: "宅配",
  name: "綠先生的店",
  phone: "0987654321",
  address: "台北市大安區忠孝東路四段100號",
};
const STORE_ADDRESS = "台北市大安區忠孝東路四段100號";

export default function InfoPage() {
  const [orderersInfo, setOrderersInfo] = useState(initialOrderersInfo);
  const [paymentInfo, setPaymentInfo] = useState(initialPaymentInfo);
  const [shippingInfo, setShippingInfo] = useState(initialShippingInfo);

  const [editingSection, setEditingSection] = useState(null);
  const [draftOrderer, setDraftOrderer] = useState(initialOrderersInfo);
  const [draftPayment, setDraftPayment] = useState(initialPaymentInfo);
  const [draftShipping, setDraftShipping] = useState(initialShippingInfo);

  const startEdit = useCallback(
    (section) => {
      setEditingSection(section);
      if (section === SECTION_ORDERER) setDraftOrderer({ ...orderersInfo });
      if (section === SECTION_PAYMENT) setDraftPayment({ ...paymentInfo });
      if (section === SECTION_SHIPPING) setDraftShipping({ ...shippingInfo });
    },
    [orderersInfo, paymentInfo, shippingInfo],
  );

  const saveOrderer = useCallback(() => {
    setOrderersInfo({ ...draftOrderer });
    setEditingSection(null);
  }, [draftOrderer]);

  const savePayment = useCallback(() => {
    setPaymentInfo({ ...draftPayment });
    setEditingSection(null);
  }, [draftPayment]);

  const saveShipping = useCallback(() => {
    setShippingInfo({ ...draftShipping });
    setEditingSection(null);
  }, [draftShipping]);

  const cancelEdit = useCallback(() => setEditingSection(null), []);

  const isOrdererEditing = editingSection === SECTION_ORDERER;
  const isPaymentEditing = editingSection === SECTION_PAYMENT;
  const isShippingEditing = editingSection === SECTION_SHIPPING;

  const sectionHeader = (title, isEditing, onEdit, onSave, onCancel) => (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-lg font-bold">{title}</h3>
      {!isEditing ? (
        <button type="button" className="btn-panel text-xs" onClick={onEdit}>
          編輯
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-primary text-xs"
            onClick={onSave}
          >
            更新
          </button>
          <button
            type="button"
            className="btn-panel text-xs"
            onClick={onCancel}
          >
            取消
          </button>
        </div>
      )}
    </div>
  );

  return (
    <section className="p-4 md:p-8 w-[300px] md:w-full md:max-w-screen-md">
      <PageTitle title="個人資訊" />

      {/* 訂購人資訊 */}
      <div className="w-full border-b border-border-50 py-12 space-y-4">
        {sectionHeader(
          "訂購人資訊",
          isOrdererEditing,
          () => startEdit(SECTION_ORDERER),
          saveOrderer,
          cancelEdit,
        )}
        {!isOrdererEditing ? (
          <>
            <InfoField
              label="訂購人姓名"
              value={orderersInfo.name}
              editing={false}
            />
            <InfoField
              label="訂購人電話"
              value={orderersInfo.phone}
              editing={false}
            />
            <InfoField
              label="訂購 Email"
              value={orderersInfo.email}
              editing={false}
              readOnly
            />
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <InfoField
                label="訂購人姓名"
                value={draftOrderer.name}
                editing={true}
                onChange={(v) => setDraftOrderer((p) => ({ ...p, name: v }))}
                placeholder="請輸入訂購人姓名"
              />
              <InfoField
                label="訂購人電話"
                value={draftOrderer.phone}
                editing={true}
                onChange={(v) => setDraftOrderer((p) => ({ ...p, phone: v }))}
                placeholder="請輸入訂購人電話"
              />
            </div>
            <InfoField label="會員 Email" value={orderersInfo.email} readOnly />
          </>
        )}
      </div>

      {/* 付款資訊（不存 CVV） */}
      <div className="w-full border-b border-border-50 py-12 space-y-4">
        {sectionHeader(
          "付款資訊",
          isPaymentEditing,
          () => startEdit(SECTION_PAYMENT),
          savePayment,
          cancelEdit,
        )}
        {!isPaymentEditing ? (
          <>
            <InfoField
              label="付款方式"
              value={paymentInfo.type}
              editing={false}
            />
            {paymentInfo.type === "信用卡" && (
              <>
                <InfoField
                  label="信用卡卡號"
                  value={paymentInfo.account}
                  editing={false}
                  mask={maskCardNumber}
                />
                <InfoField
                  label="到期日"
                  value={paymentInfo.expiryDate}
                  editing={false}
                />
                <InfoField
                  label="持卡人姓名"
                  value={paymentInfo.cardHolderName}
                  editing={false}
                />
              </>
            )}
          </>
        ) : (
          <>
            <div className="w-full md:w-fit flex rounded-md overflow-hidden gap-0">
              <button
                type="button"
                className={`btn-select flex-1 sm:flex-initial ${draftPayment.type === "信用卡" ? "active" : ""}`}
                onClick={() =>
                  setDraftPayment((p) => ({ ...p, type: "信用卡" }))
                }
              >
                信用卡
              </button>
              <button
                type="button"
                className={`btn-select flex-1 sm:flex-initial ${draftPayment.type === "貨到付款" ? "active" : ""}`}
                onClick={() =>
                  setDraftPayment((p) => ({ ...p, type: "貨到付款" }))
                }
              >
                貨到付款
              </button>
            </div>
            {draftPayment.type === "信用卡" ? (
              <>
                <InfoField
                  label="信用卡卡號"
                  value={formatCardNumber(draftPayment.account)}
                  editing={true}
                  onChange={(v) =>
                    setDraftPayment((p) => ({
                      ...p,
                      account: v.replace(/\D/g, "").slice(0, 16),
                    }))
                  }
                  placeholder="xxxx xxxx xxxx xxxx"
                />
                <div className="flex flex-col gap-4 md:flex-row md:gap-8">
                  <InfoField
                    label="到期日"
                    value={draftPayment.expiryDate}
                    editing={true}
                    onChange={(v) =>
                      setDraftPayment((p) => ({ ...p, expiryDate: v }))
                    }
                    placeholder="MM / YY"
                  />
                  <InfoField
                    label="持卡人姓名"
                    value={draftPayment.cardHolderName}
                    editing={true}
                    onChange={(v) =>
                      setDraftPayment((p) => ({ ...p, cardHolderName: v }))
                    }
                    placeholder="請輸入持卡人姓名"
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted">
                貨到付款適用於折價前總金額 2000 元以下訂單
              </p>
            )}
          </>
        )}
      </div>

      {/* 收件資訊（不開放預計取貨日） */}
      <div className="w-full  py-12 space-y-4">
        {sectionHeader(
          "收件資訊",
          isShippingEditing,
          () => startEdit(SECTION_SHIPPING),
          saveShipping,
          cancelEdit,
        )}
        {!isShippingEditing ? (
          <>
            <InfoField
              label="收件方式"
              value={shippingInfo.type}
              editing={false}
            />
            <InfoField
              label="收件人姓名"
              value={shippingInfo.name}
              editing={false}
            />
            <InfoField
              label="收件人電話"
              value={shippingInfo.phone}
              editing={false}
            />
            {shippingInfo.type === "宅配" ? (
              <InfoField
                label="收件地址"
                value={shippingInfo.address}
                editing={false}
              />
            ) : (
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-8">
                <span className="form-label text-muted">綠蕨飾店址</span>
                <span className="text-default text-muted">{STORE_ADDRESS}</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="w-full md:w-fit flex rounded-md overflow-hidden gap-0">
              <button
                type="button"
                className={`btn-select flex-1 sm:flex-initial ${draftShipping.type === "宅配" ? "active" : ""}`}
                onClick={() =>
                  setDraftShipping((p) => ({ ...p, type: "宅配" }))
                }
              >
                宅配
              </button>
              <button
                type="button"
                className={`btn-select flex-1 sm:flex-initial ${draftShipping.type === "到店取貨" ? "active" : ""}`}
                onClick={() =>
                  setDraftShipping((p) => ({ ...p, type: "到店取貨" }))
                }
              >
                到店取貨
              </button>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <InfoField
                label="收件人姓名"
                value={draftShipping.name}
                editing={true}
                onChange={(v) => setDraftShipping((p) => ({ ...p, name: v }))}
                placeholder="請輸入收件人姓名"
              />
              <InfoField
                label="收件人電話"
                value={draftShipping.phone}
                editing={true}
                onChange={(v) => setDraftShipping((p) => ({ ...p, phone: v }))}
                placeholder="請輸入收件人電話"
              />
            </div>
            {draftShipping.type === "宅配" ? (
              <InfoField
                label="收件地址"
                value={draftShipping.address}
                editing={true}
                onChange={(v) =>
                  setDraftShipping((p) => ({ ...p, address: v }))
                }
                placeholder="請輸入收件地址"
              />
            ) : (
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-8">
                <span className="form-label text-muted">綠蕨飾店址</span>
                <span className="text-default text-muted">{STORE_ADDRESS}</span>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
