import axios from "axios";

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;
const base = `${VITE_API_URL}/api/${VITE_API_PATH}`;

// 後台 GET 優惠券列表（支援分頁）
export function getAdminCoupons(page = 1) {
  return axios.get(`${base}/admin/coupons`, { params: { page } });
}

// 後台 POST 新增優惠券
export function createAdminCoupon(payload) {
  return axios.post(`${base}/admin/coupon`, { data: payload });
}

// 後台 PUT 更新優惠券
export function updateAdminCoupon(id, payload) {
  return axios.put(`${base}/admin/coupon/${id}`, { data: payload });
}

// 後台 DELETE 優惠券
export function deleteAdminCoupon(id) {
  return axios.delete(`${base}/admin/coupon/${id}`);
}

// 前台 POST 套用優惠券（回傳折後 final_total）
export function applyCouponCode(code) {
  return axios.post(`${base}/coupon`, { data: { code: String(code).trim() } });
}
