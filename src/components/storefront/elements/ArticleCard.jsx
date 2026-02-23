import { Link } from 'react-router-dom';
import { formatDateCard } from '../../../data/articles';

export default function ArticleCard({ article }) {
  if (!article) return null;

  return (
    <>
    <article>
      <Link to={`/articles/${article.slug}`} 
            className="link-card text-textDefaultColor">
        <div className="w-full aspect-[16/9] rounded-md overflow-hidden mb-2">
          {article.cover_image?.src ? (
            <img 
              src={article.cover_image.src} 
              alt={article.cover_image.alt || article.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex-col-center-center bg-panel-25">
              🌿
            </div>
          )}
        </div>
        <div className="flex-row-start-center gap-4 py-2">
        <time dateTime={article.published_at}>
          {formatDateCard(article.published_at)}
        </time>
        {article.category && (
          <div className="bg-panel-25 rounded-md px-3 py-1 text-xs font-bold">
            {article.category}
          </div>
        )}
        </div>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>

      </Link>
    </article>
    
    </>
  );
}

