import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug, formatDate, formatDateDisplay, getRelatedProducts } from '../../../data/articles';
import ProductCard from '../../../components/storefront/elements/ProductCard';
import NotFoundPage from '../../storefront/staticPages/NotFoundPage';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return <NotFoundPage />;
  }

  return (

    <>
    {article.cover_image?.src && (    

      <section className="relative w-full h-[480px]">
        <div className="w-full h-full">
          {article.cover_image?.src ? (
            <img 
              src={article.cover_image.src} 
              alt={article.cover_image.alt}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-panel to-primary-50" />
          )}
        </div>

      </section>
    )}

    <section >
      <div className="p-8">
        <time className="text-secondary" dateTime={article.published_at}>
          {formatDate(article.published_at)}
        </time>
        <h1 className="text-3xl">{article.title}</h1>
      </div>
    </section>

    <section >

      <div className="mx-auto max-w-screen-md space-y-8 p-8">

        <p className="font-serif text-lg text-secondary">{article.excerpt}</p>
      
        
        {article.content.map((item, index) => {
          if (item.type === 'paragraph') {
            return (
              <p key={index} className="article-paragraph">
                {item.text}
              </p>
            );
          } else if (item.type === 'image') {
            return (
              <figure key={index} className="article-image-figure">
                <div className="article-image-wrapper">
                  {item.src ? (
                    <img 
                      src={item.src} 
                      alt={item.alt || ''} 
                      className="article-image"
                    />
                  ) : (
                    <div className="article-image-placeholder">
                      <span className="text-6xl opacity-20">🌿</span>
                    </div>
                  )}
                </div>
                {item.caption && (
                  <figcaption className="article-image-caption">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            );
          }
          return null;
        })}
        
      </div>
    </section>

    


    <section >
      <div className=" border-t border-border py-12">

        <div className="max-w-screen-md mx-auto flex flex-col gap-16 p-8">

          <div className="flex flex-col gap-4">

            <h3>相關商品</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {getRelatedProducts(3).map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="link-card">
                  <ProductCard {...product} usedOnPage="products" />
                </Link>
              ))}
            </div>
          </div>

          <Link to="/articles">
            <button className="btn-panel text-xs">
              ← 返回 Journal
            </button>
          </Link>

        </div>

      </div>
    </section>

    </>
  );
}

