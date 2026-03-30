/**
 * 前台金額顯示用千分位（與 CartItem / OrderSummary 的 toLocaleString 習慣一致）
 * @param {unknown} value
 * @returns {string}
 */
export function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("zh-TW");
}
