import axios from 'axios';
import { store } from '../store/store';
import { showStorefrontToast } from '../slices/StorefrontToastSlice';

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;
const base = `${VITE_API_URL}/api/${VITE_API_PATH}`;

/**
 * GET 購物車
 * @returns {Promise} axios response, res.data.data.carts, res.data.data.total, res.data.data.final_total
 */
export function getCart() {
  return axios.get(`${base}/cart`);
}

/**
 * 從購物車 API 回傳的 data 中，取得指定商品目前在購物車的總數量（供庫存檢查用）
 * @param {object} cartData - getCart() 的 res.data
 * @param {string} productId
 * @returns {number}
 */
export function getProductQtyInCart(cartData, productId) {
  const carts = cartData?.data?.carts;
  if (!Array.isArray(carts)) return 0;
  return carts
    .filter((c) => c.product_id === productId)
    .reduce((sum, c) => sum + (c.qty || 0), 0);
}

/**
 * POST 加入購物車
 * @param {string} productId
 * @param {number} qty
 * @returns {Promise} axios response
 */
export function addToCart(productId, qty = 1) {
  return axios.post(`${base}/cart`, {
    data: { product_id: productId, qty },
  });
}

/**
 * PUT 更新購物車品項
 * @param {string} cartItemId - 購物車品項 id (cart.id)
 * @param {string} productId
 * @param {number} qty
 * @returns {Promise} axios response
 */
export function updateCartItem(cartItemId, productId, qty) {
  return axios.put(`${base}/cart/${cartItemId}`, {
    data: { product_id: productId, qty },
  });
}

/**
 * DELETE 刪除單一購物車品項
 * @param {string} cartItemId - 購物車品項 id (cart.id)
 * @returns {Promise} axios response
 */
export function removeCartItem(cartItemId) {
  return axios.delete(`${base}/cart/${cartItemId}`);
}

/**
 * DELETE 清空購物車
 * @returns {Promise} axios response
 */
export function clearCart() {
  return axios.delete(`${base}/carts`);
}

// --- 自訂事件：通知 MainLayout 更新購物車數量 ---

export const EVENT_CART_UPDATED = 'cartUpdated';

export function notifyCartUpdated() {
  window.dispatchEvent(new CustomEvent(EVENT_CART_UPDATED));
}

/**
 * 顯示前台 Toast（由 Redux storefrontToast 控管）
 * @param {string} message
 */
export function notifyToast(message) {
  store.dispatch(showStorefrontToast(message));
}

// 加入購物車（含庫存檢查）已改由 Redux cartSlice.addToCartWithStockCheck 處理，從 state.products + state.cart 判斷，不再呼叫 getCart。
