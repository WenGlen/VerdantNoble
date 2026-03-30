import { Link } from "react-router-dom";

function formatCardDate(value) {
  if (!value) return "";
  // Unix timestamp（秒）
  const date =
    typeof value === "number" ? new Date(value * 1000) : new Date(value);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export default function ArticleCard({ article }) {
  if (!article) return null;

  // 相容 API 格式與靜態資料格式
  const imgSrc = article.image || article.cover_image?.src;
  const imgAlt = article.cover_image?.alt || article.title;
  const excerpt = article.description || article.excerpt;
  const dateValue = article.create_at || article.published_at;
  const routeId = article.id || article.slug;
  // tag 可以是陣列（API）或字串（靜態）
  const firstTag = Array.isArray(article.tag)
    ? article.tag[0]
    : article.category || null;

  return (
    <article>
      <Link
        to={`/articles/${routeId}`}
        className="link-card text-textDefaultColor"
      >
        <div className="w-full aspect-[16/9] rounded-md overflow-hidden mb-2">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={imgAlt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex-col-center-center bg-panel-25">
              🌿
            </div>
          )}
        </div>
        <div className="flex-row-start-center gap-4 py-2">
          <time dateTime={String(dateValue)}>{formatCardDate(dateValue)}</time>
          {firstTag && (
            <div className="bg-panel-25 rounded-md px-3 py-1 text-xs font-bold">
              {firstTag}
            </div>
          )}
        </div>
        <h3>{article.title}</h3>
        <p>{excerpt}</p>
      </Link>
    </article>
  );
}
