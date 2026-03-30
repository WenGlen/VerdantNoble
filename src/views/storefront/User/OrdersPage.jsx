import { useState, useEffect, useMemo } from "react";
import OrderItem from "../../../components/storefront/elements/OrderItem";
import PageTitle from "../../../components/storefront/elements/PageTitle";
import { getOrders, getOrder } from "../../../api/orders";
import {
  mapApiOrderDetail,
  mapApiOrderListRow,
} from "../../../utils/mapApiOrderToView";

export default function OrdersPage() {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewOrders, setViewOrders] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const listRes = await getOrders(1);
        if (cancelled) return;

        if (listRes.data?.success === false) {
          throw new Error(listRes.data?.message || "讀取訂單列表失敗");
        }

        const rawList = Array.isArray(listRes.data?.orders)
          ? listRes.data.orders
          : [];

        const detailResults = await Promise.all(
          rawList.map((row) =>
            getOrder(row.id)
              .then((r) =>
                r.data?.success === false ? null : (r.data?.order ?? null),
              )
              .catch(() => null),
          ),
        );

        if (cancelled) return;

        const mapped = rawList.map((row, i) => {
          const detail = detailResults[i];
          return detail && detail.id
            ? mapApiOrderDetail(detail)
            : mapApiOrderListRow(row);
        });

        setViewOrders(mapped);
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message || e?.message || "載入訂單失敗");
          setViewOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const { inProgressOrders, orderHistory } = useMemo(() => {
    const pending = viewOrders.filter(
      (o) => !String(o.status).includes("已完成"),
    );
    const done = viewOrders.filter((o) => String(o.status).includes("已完成"));
    const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);
    pending.sort(byDateDesc);
    done.sort(byDateDesc);
    return { inProgressOrders: pending, orderHistory: done };
  }, [viewOrders]);

  const toggleOrder = (orderId) => {
    setExpandedOrderId((id) => (id === orderId ? null : orderId));
  };

  return (
    <section className="w-full p-4 md:p-8 max-w-screen-md space-y-8">
      <PageTitle title="訂單" />

      {loading && <p className="text-sm text-muted">載入訂單中…</p>}

      {error && !loading && (
        <p className="text-sm text-red-700 border border-border rounded-md p-4 bg-panel-25">
          {error}
          <span className="block mt-2 text-muted text-xs">
            訂單 API 通常需與購物車相同帶入 Authorization；請確認已取得有效
            Token 後再試。
          </span>
        </p>
      )}

      {!loading && !error && viewOrders.length === 0 && (
        <p className="text-sm text-muted">目前尚無訂單紀錄。</p>
      )}

      {!loading && inProgressOrders.length > 0 && (
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

      {!loading && orderHistory.length > 0 && (
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
      )}
    </section>
  );
}
