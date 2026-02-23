import React from 'react';
import { Link } from 'react-router-dom';
import OrderSummary from '../../../components/storefront/sections/Order/OrderSummary';
import PageTitle from '../../../components/storefront/elements/PageTitle';

const FREE_SHIPPING_THRESHOLD = 2000;
const DEFAULT_FREIGHT = 120;
const STORE_ADDRESS = '台北市大安區忠孝東路四段100號';
const WEEKDAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

function formatDateLabel(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr.replace(/-/g, '/'));
    if (Number.isNaN(d.getTime())) return dateStr;
    const y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate(), w = d.getDay();
    return `${y}/${m}/${day} (週${WEEKDAY_NAMES[w]})`;
}

function getDeliveryDatePlusDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return formatDateLabel(`${y}-${m}-${day}`);
}

export default function CompletePage({ cartItems = [], orderConfirmData }) {
    const items = Array.isArray(cartItems) ? cartItems : [];
    const data = orderConfirmData || {};
    const { orderersInfo = {}, shippingInfo = {}, freight: dataFreight, appliedDiscount = 0 } = data;

    const isPickup = shippingInfo.type === '到店取貨';
    const expectedDateLabel = isPickup ? '預計取貨日' : '預計到貨日';
    const expectedDateValue = isPickup
        ? formatDateLabel(shippingInfo.pickupTime)
        : getDeliveryDatePlusDays(4);

    const freight = dataFreight != null
        ? dataFreight
        : (items.reduce((acc, item) => acc + (item?.price ?? 0) * (item?.quantity ?? 0), 0) >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_FREIGHT);

    return (
        <section className="w-full p-4 md:p-8 max-w-screen-md space-y-6 md:space-y-8">
            <PageTitle title="完成訂單" mobile="hidden"/>

            {/* 完成說明 */}
            <div className="w-full border-b border-border-50 py-6 md:py-8 space-y-2">
                <p className="text-lg font-medium">感謝您的訂購，訂單已完成。</p>
                <p className="text-sm text-muted">我們已收到您的訂單，請留意收件資訊與預計到貨時間。</p>
            </div>

            {/* 訂單資訊 */}
            <div className="w-full border-b border-border-50 py-6 md:py-8 space-y-6">
                <h3 className="text-lg font-bold">訂單資訊</h3>

                {/* 訂單編號、預計取/到貨日、確認信 */}
                <div className="grid grid-cols-1 gap-2">
                    <div className="grid grid-cols-2 gap-2 md:gap-4 py-2 border-b border-border-50">
                        <span className="text-sm text-muted">訂單編號</span>
                        <span className="text-sm font-medium text-right">#PT-88291</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:gap-4 py-2 border-b border-border-50">
                            <span className="text-sm text-muted">訂購人姓名</span>
                            <span className="text-sm font-medium text-right">{orderersInfo.name || '—'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:gap-4 py-2">
                        <span className="text-sm text-muted">確認信已寄至</span>
                        <span className="text-sm font-medium text-right truncate">{orderersInfo.email || '—'}（沒有真的寄啦）</span>
                    </div>
                </div>

                {/* 收件資訊 */}
                <div className="space-y-2">
                    <h4 className="text-base font-bold">收件資訊</h4>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="grid grid-cols-2 gap-2 md:gap-4 py-2 border-b border-border-50">
                            <span className="text-sm text-muted">收件人姓名</span>
                            <span className="text-sm font-medium text-right">{shippingInfo.name || '—'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 md:gap-4 py-2 border-b border-border-50">
                            <span className="text-sm text-muted">收件人電話</span>
                            <span className="text-sm font-medium text-right">{shippingInfo.phone || '—'}</span>
                        </div>
                        {shippingInfo.type === '宅配' ? (
                            <div className="grid grid-cols-2 gap-2 md:gap-4 py-2 border-b border-border-50">
                                <span className="text-sm text-muted">宅配收件地址</span>
                                <span className="text-sm font-medium text-right">{shippingInfo.address || '—'}</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 md:gap-4 py-2">
                                <span className="text-sm text-muted">取貨店址</span>
                                <span className="text-sm font-medium text-right">{STORE_ADDRESS}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 md:gap-4 py-2 border-b border-border-50">
                            <span className="text-sm text-muted">{expectedDateLabel}</span>
                            <span className="text-sm font-medium text-right">{expectedDateValue}</span>
                        </div>
                    </div>
                </div>

                {/* 訂單摘要與金額 */}
                <div className="bg-panel-50 p-4 rounded-md">
                    <OrderSummary items={items} freight={freight} discount={appliedDiscount} />
                </div>



            </div>

            {/* 操作按鈕 */}
            <div className="w-full flex gap-4 justify-end">
                <Link to="/user/orders" className="w-full md:w-auto">
                    <button className="btn-secondary w-full">
                    查看我的訂單
                    </button>
                </Link>
                <Link to="/products" className="w-full md:w-auto">
                    <button className="btn-primary w-full">
                    繼續選購
                    </button>
                </Link>
            </div>
        </section>
    );
}
