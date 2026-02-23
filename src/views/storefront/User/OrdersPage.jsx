import { useState } from 'react';
import { inProgressOrders, orderHistory } from '../../../data/userData';
import OrderItem from '../../../components/storefront/elements/OrderItem';
import PageTitle from '../../../components/storefront/elements/PageTitle';

export default function OrdersPage() {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrder = (orderId) => {
    setExpandedOrderId((id) => (id === orderId ? null : orderId));
  };

  return (
    <section className="w-full p-4 md:p-8 max-w-screen-md space-y-8">
      <PageTitle title="訂單"/>

      {inProgressOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold">處理中</h3>
          <ul className="flex flex-col gap-4 list-none p-0 m-0">
            {inProgressOrders.map((order) => (
              <li key={order.id}>
                <OrderItem
                  order={order}
                  isExpanded={expandedOrderId === order.id}
                  onToggle={() => toggleOrder(order.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold">歷史訂單</h3>
        <ul className="flex flex-col gap-4 list-none p-0 m-0">
          {orderHistory.map((order) => (
            <li key={order.id}>
              <OrderItem
                order={order}
                isExpanded={expandedOrderId === order.id}
                onToggle={() => toggleOrder(order.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
