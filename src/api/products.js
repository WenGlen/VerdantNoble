import axios from "axios";

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;
const base = `${VITE_API_URL}/api/${VITE_API_PATH}`;

/**
 * GET 全部產品（前台）
 * @returns {Promise} axios response, res.data.products
 */
export function getProductsAll() {
  return axios.get(`${base}/products/all`);
}
