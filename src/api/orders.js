import axios from "axios";

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;
const base = `${VITE_API_URL}/api/${VITE_API_PATH}`;

//GET 訂單列表（需帶入與購物車等客戶端 API 相同之 Authorization）
export function getOrders(page = 1) {
  return axios.get(`${base}/orders`, { params: { page } });
}

// GET 單筆訂單明細
export function getOrder(orderId) {
  return axios.get(`${base}/order/${orderId}`);
}
