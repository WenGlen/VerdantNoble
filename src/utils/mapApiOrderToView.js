// 將課程 API（訂單列表單筆、尚未含明細品項）轉成 OrderItem 用的顯示結構

export function mapApiOrderListRow(row) {
  const user = row.user || {};
  const ts = row.create_at;
  const date =
    typeof ts === "number"
      ? new Date(ts * 1000).toISOString()
      : typeof ts === "string"
        ? ts
        : new Date().toISOString();

  return {
    id: row.id,
    date,
    status: row.is_paid ? "已完成" : "待付款",
    total: null,
    payment: row.is_paid ? "已付款" : "待付款",
    paymentNote: row.is_paid ? "已付款" : "待付款",
    delivery: user.address ? "宅配" : "到店取貨",
    recipientName: user.name || "",
    recipientPhone: user.tel || "",
    recipientAddress: user.address || "",
    ordererInfo: {
      name: user.name || "",
      phone: user.tel || "",
      email: user.email || "",
    },
    items: [],
    freight: 0,
    discount: 0,
    detailLoadFailed: true,
  };
}

function apiProductLinesToItems(products) {
  if (!products) return [];
  const lines = Array.isArray(products) ? [] : Object.values(products);
  return lines.map((p, idx) => {
    const qty = Math.max(1, Number(p.qty) || 1);
    const lineTotal = Number(p.final_total ?? p.total ?? 0);
    const unitPrice = qty > 0 ? lineTotal / qty : lineTotal;
    const prod = p.product || {};
    return {
      id: p.id ?? p.product_id ?? `line-${idx}`,
      name: prod.title ?? "商品",
      price: unitPrice,
      quantity: qty,
      image: prod.imageUrl || "",
    };
  });
}

/**
 * 將 GET /order/{id} 回傳的 order 轉成 OrderItem 用結構
 * @param {object} order - res.data.order
 */
export function mapApiOrderDetail(order) {
  const user = order.user || {};
  const ts = order.create_at;
  const date =
    typeof ts === "number"
      ? new Date(ts * 1000).toISOString()
      : typeof ts === "string"
        ? ts
        : new Date().toISOString();

  const items = apiProductLinesToItems(order.products);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const orderTotal = Number(order.total);
  const freight =
    Number.isFinite(orderTotal) && orderTotal >= subtotal
      ? Math.max(0, orderTotal - subtotal)
      : 0;

  return {
    id: order.id,
    date,
    status: order.is_paid ? "已完成" : "待付款",
    total: Number.isFinite(orderTotal) ? orderTotal : subtotal + freight,
    payment: order.is_paid ? "已付款" : "待付款",
    paymentNote: order.is_paid ? "已付款" : "待付款",
    delivery: user.address ? "宅配" : "到店取貨",
    recipientName: user.name || "",
    recipientPhone: user.tel || "",
    recipientAddress: user.address || "",
    ordererInfo: {
      name: user.name || "",
      phone: user.tel || "",
      email: user.email || "",
    },
    items,
    freight,
    discount: 0,
    estimatedTime:
      order.message && String(order.message).trim()
        ? `留言：${order.message}`
        : undefined,
    detailLoadFailed: false,
  };
}
