// 用户数据（模拟数据）
export const userProfile = {
  name: "陳雅文",
  email: "yawen@example.com",
  phone: "0912-345-678"
};

/** 訂單結構：status 準備中|運送中|已送達；payment 信用卡付清|貨到付款；delivery 宅配|到店取貨 */
const orderShape = (overrides) => ({
  status: '已送達',
  total: 0,
  payment: '信用卡付清',
  delivery: '宅配',
  recipientName: '',
  recipientPhone: '',
  recipientAddress: '',
  ordererInfo: { name: '', phone: '', email: '' },
  items: [],
  freight: 0,
  discount: 0,
  ...overrides,
});

export const inProgressOrders = [
  orderShape({
    id: "ORD-2025-001",
    date: "2025-01-15",
    status: "準備中",
    estimatedTime: "預計 3-5 個工作天",
    total: 2850,
    payment: "信用卡付清",
    recipientName: "陳雅文",
    recipientPhone: "0912-345-678",
    recipientAddress: "106 台北市大安區信義路四段 123 號 5 樓",
    ordererInfo: { name: "陳雅文", phone: "0912-345-678", email: "yawen@example.com" },
    items: [
      { id: 1, name: "銀鹿鹿角蕨（中）", price: 1200, quantity: 1, image: 'https://i.meee.com.tw/cquTDFC.png' },
      { id: 2, name: "手工柚木固定板", price: 650, quantity: 2, image: 'https://i.meee.com.tw/OYadPwo.png' },
    ],
    freight: 120,
    discount: 0,
  }),
  orderShape({
    id: "ORD-2025-002",
    date: "2025-02-10",
    status: "運送中",
    total: 1580,
    payment: "貨到付款",
    delivery: "到店取貨",
    recipientName: "陳雅文",
    recipientPhone: "0912-345-678",
    recipientAddress: "",
    ordererInfo: { name: "陳雅文", phone: "0912-345-678", email: "yawen@example.com" },
    items: [
      { id: 3, name: "象耳鹿角蕨", price: 1460, quantity: 1, image: 'https://i.meee.com.tw/HDIDrWY.png' },
    ],
    freight: 120,
    discount: 0,
  }),
];

export const orderHistory = [
  orderShape({
    id: "ORD-2024-089",
    date: "2024-12-20",
    status: "已送達",
    total: 1460,
    recipientName: "陳雅文",
    recipientPhone: "0912-345-678",
    recipientAddress: "106 台北市大安區信義路四段 123 號 5 樓",
    ordererInfo: { name: "陳雅文", phone: "0912-345-678", email: "yawen@example.com" },
    items: [
      { id: 4, name: "象耳鹿角蕨", price: 1460, quantity: 1, image: 'https://i.meee.com.tw/HDIDrWY.png' },
    ],
    freight: 0,
    discount: 0,
  }),
  orderShape({
    id: "ORD-2024-076",
    date: "2024-11-15",
    status: "已送達",
    total: 2420,
    recipientName: "陳雅文",
    recipientPhone: "0912-345-678",
    recipientAddress: "106 台北市大安區信義路四段 123 號 5 樓",
    ordererInfo: { name: "陳雅文", phone: "0912-345-678", email: "yawen@example.com" },
    items: [
      { id: 5, name: "銀鹿鹿角蕨（小）", price: 980, quantity: 1, image: 'https://i.meee.com.tw/cquTDFC.png' },
      { id: 6, name: "手工雪松固定板", price: 720, quantity: 2, image: 'https://i.meee.com.tw/OYadPwo.png' },
    ],
    freight: 120,
    discount: 0,
  }),
  orderShape({
    id: "ORD-2024-062",
    date: "2024-10-08",
    status: "已送達",
    total: 2100,
    delivery: "到店取貨",
    recipientName: "陳雅文",
    recipientPhone: "0912-345-678",
    recipientAddress: "",
    ordererInfo: { name: "陳雅文", phone: "0912-345-678", email: "yawen@example.com" },
    items: [
      { id: 7, name: "女王鹿角蕨", price: 2100, quantity: 1, image: 'https://i.meee.com.tw/cquTDFC.png' },
    ],
    freight: 0,
    discount: 0,
  }),
  orderShape({
    id: "ORD-2024-051",
    date: "2024-09-12",
    status: "已送達",
    total: 1320,
    recipientName: "陳雅文",
    recipientPhone: "0912-345-678",
    recipientAddress: "106 台北市大安區信義路四段 123 號 5 樓",
    ordererInfo: { name: "陳雅文", phone: "0912-345-678", email: "yawen@example.com" },
    items: [
      { id: 8, name: "銀鹿鹿角蕨（中）", price: 1200, quantity: 1, image: 'https://i.meee.com.tw/cquTDFC.png' },
    ],
    freight: 120,
    discount: 0,
  }),
  orderShape({
    id: "ORD-2024-038",
    date: "2024-08-25",
    status: "已送達",
    total: 2910,
    recipientName: "陳雅文",
    recipientPhone: "0912-345-678",
    recipientAddress: "106 台北市大安區信義路四段 123 號 5 樓",
    ordererInfo: { name: "陳雅文", phone: "0912-345-678", email: "yawen@example.com" },
    items: [
      { id: 9, name: "象耳鹿角蕨", price: 1460, quantity: 1, image: 'https://i.meee.com.tw/HDIDrWY.png' },
      { id: 10, name: "手工柚木固定板", price: 650, quantity: 2, image: 'https://i.meee.com.tw/OYadPwo.png' },
    ],
    freight: 120,
    discount: 0,
  }),
];

export const addresses = [
  {
    id: "addr-001",
    isPrimary: true,
    recipient: "陳雅文",
    address: "106 台北市大安區信義路四段 123 號 5 樓",
    phone: "0912-345-678"
  },
  {
    id: "addr-002",
    isPrimary: false,
    recipient: "陳雅文",
    address: "100 台北市中正區重慶南路一段 456 號",
    phone: "0912-345-678"
  }
];
