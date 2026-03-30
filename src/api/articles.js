import axios from "axios";

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;
const base = `${VITE_API_URL}/api/${VITE_API_PATH}`;

/**
 * GET 全部公開文章（前台，逐頁累積）
 * @returns {Promise<Array>} 文章陣列
 */
export async function getArticlesAll() {
  let all = [];
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const res = await axios.get(`${base}/articles?page=${page}`);
    if (res.data?.success) {
      all = [...all, ...(res.data.articles || [])];
      hasMore = res.data.pagination?.has_next || false;
      page++;
    } else {
      hasMore = false;
    }
  }
  return all;
}

/**
 * GET 單篇文章（前台，含完整 content）
 * @param {string} id
 * @returns {Promise} axios response
 */
export function getArticleById(id) {
  return axios.get(`${base}/article/${id}`);
}
