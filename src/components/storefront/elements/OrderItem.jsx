import OrderSummary from '../sections/Order/OrderSummary';

function formatDate(dateString) {
  const date = new Date(dateString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

/** 單行顯示：label + 值 */
function InfoRow({ label, value }) {
  const display = value != null && value !== '' ? value : '—';
  return (
    <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-8">
      <span className="form-label text-muted">{label}</span>
      <span className="text-default min-w-0">{display}</span>
    </div>
  );
}

export default function OrderItem({ order, isExpanded, onToggle }) {
  const {
    id,
    date,
    status,
    total,
    payment,
    delivery,
    recipientName,
    recipientPhone,
    recipientAddress,
    ordererInfo,
    items = [],
    freight = 0,
    discount = 0,
    estimatedTime,
  } = order;

  const deliveryDisplay =
    delivery === '到店取貨' ? '自行至綠蕨飾店內取貨' : (recipientAddress || '—');

  const feeDisplay =
    total != null
      ? `$NT ${Number(total).toLocaleString()} ${payment === '貨到付款' ? '貨到付款' : '信用卡付清'}`
      : '—';

  return (
    <div className="relative w-full border-b border-border overflow-hidden">
        <button type="button"
                className={`btn-panel text-xs absolute right-2 top-16  md:top-4 ${isExpanded ? 'active' : ''}`}
                onClick={onToggle}>
          {isExpanded ? '收起訂單資訊' : '查看訂單資訊'}
        </button>
      {/* 收闔時固定顯示的摘要 */}
      <div className="p-4 space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">{formatDate(date)} · {id}</span>
          <span className="text-muted">·</span>
          <span className="font-bold text-default">{status}</span>
        </div>
        {estimatedTime && <p className="text-sm text-muted">{estimatedTime}</p>}

        <InfoRow label="費用" value={feeDisplay} />
        <InfoRow label="收件人" value={[recipientName, recipientPhone].filter(Boolean).join(' ') || null}/>
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-8">
          <span className="hidden md:block form-label"/>
          <span className="text-default min-w-0">{deliveryDisplay}</span>
        </div>
      </div>

      {/* 展開時：訂購人資訊 + 訂單摘要 */}
      {isExpanded && (
        <div className="p-8 space-y-6 bg-panel-25">
          <div>
            <div className="space-y-2">
              <InfoRow label="訂購人姓名" value={ordererInfo?.name} />
              <InfoRow label="訂購人電話" value={ordererInfo?.phone} />
              <InfoRow label="訂購 Email" value={ordererInfo?.email} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-muted mb-3">訂單摘要</h4>
            <OrderSummary items={items} freight={freight} discount={discount} />
          </div>
        </div>
      )}
    </div>
  );
}
