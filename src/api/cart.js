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

// --- 加入購物車（含庫存檢查與 Toast，統一邏輯）---

const MSG_LIMIT = '超過可購數量上限<br/>（庫存僅 ';
const MSG_LIMIT_SUFFIX = '）';
const MSG_ADDED = '已加入購物車';
const MSG_FAIL = '加入購物車失敗<br/>（超過可購數量上限）';

/**
 * 檢查庫存後加入購物車，並依結果顯示 Toast、觸發 cartUpdated。
 * 相同產品會累加數量（先 GET 購物車，若已有該品項則 PUT 更新數量，否則 POST 新增）。
 * @param {object} params
 * @param {string} params.productId - 商品 id
 * @param {number} [params.qty=1] - 數量
 * @param {number|null} [params.stock=null] - 庫存數量，有值時會先 GET 購物車檢查總量
 * @param {string} [params.unit=''] - 單位（用於庫存上限 Toast，如「個」）
 * @returns {Promise<{ success: boolean }>} 是否成功加入
 */
export async function addToCartWithStockCheck({ productId, qty = 1, stock = null, unit = '' }) {
  try {
    const cartRes = await getCart();
    const carts = cartRes.data?.data?.carts;
    const currentQty = getProductQtyInCart(cartRes.data, productId);

    if (stock != null && currentQty + qty > stock) {
      notifyToast(`${MSG_LIMIT}${stock} ${unit}${MSG_LIMIT_SUFFIX}`);
      return { success: false };
    }

    const existing = Array.isArray(carts) ? carts.find((c) => c.product_id === productId) : null;
    if (existing) {
      await updateCartItem(existing.id, productId, (existing.qty || 0) + qty);
    } else {
      await addToCart(productId, qty);
    }
    notifyCartUpdated();
    notifyToast(MSG_ADDED);
    return { success: true };
  } catch (err) {
    const msg = err.response?.data?.message || MSG_FAIL;
    notifyToast(msg);
    return { success: false };
  }
}
