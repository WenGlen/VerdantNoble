import { useMatches } from 'react-router-dom';
import { useEffect } from 'react';

const SITE_NAME = '綠蕨飾';

/**
 * 依當前路由的 handle.title 設定 document.title
 * 路由需在 handle 中定義 title，例如：handle: { title: '首頁' }
 */
export default function DocumentTitle() {
  const matches = useMatches();
  // 取得最內層路由的 title（優先使用子路由）
  const titleMatch = [...matches].reverse().find((m) => m.handle?.title);

  useEffect(() => {
    if (titleMatch?.handle?.title) {
      if (titleMatch.handle.title === '') {
        document.title = SITE_NAME;
      } else {
        document.title = `${titleMatch.handle.title} | ${SITE_NAME}`;
      }
    }
  }, [titleMatch?.handle?.title]);

  return null;
}
