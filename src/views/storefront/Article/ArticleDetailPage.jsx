import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getArticleById } from '../../../api/articles';
import { fetchProducts } from '../../../slices/productsSlice';
import ProductCard from '../../../components/storefront/elements/ProductCard';
import NotFoundPage from '../../storefront/staticPages/NotFoundPage';

function formatDate(ts) {
  if (!ts) return '';
  const date = typeof ts === 'number' ? new Date(ts * 1000) : new Date(ts);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function parseContent(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// 將文字段落依換行切分，`- ` 開頭的行轉為點列
function renderTextContent(text, baseClass) {
  if (!text) return null;
  const lines = text.split('\n');

  const segments = [];
  let currentList = [];

  for (const line of lines) {
    if (/^-\s/.test(line)) {
      currentList.push(line.replace(/^-\s/, ''));
    } else {
      if (currentList.length) {
        segments.push({ type: 'list', items: [...currentList] });
        currentList = [];
      }
      segments.push({ type: 'line', text: line });
    }
  }
  if (currentList.length) {
    segments.push({ type: 'list', items: currentList });
  }

  return segments.map((seg, i) => {
    if (seg.type === 'list') {
      return (
        <ul key={i} className={`list-disc pl-5 space-y-1 ${baseClass}`}>
          {seg.items.map((item, j) => <li key={j}>{item}</li>)}
        </ul>
      );
    }
    // 空行保留為間距，有文字才渲染
    return seg.text.trim()
      ? <p key={i} className={baseClass}>{seg.text}</p>
      : <div key={i} className="h-2" />;
  });
}

export default function ArticleDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const productsList = useSelector((state) => state.products.list);

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setLoading(true);
      setNotFound(false);
    });
    getArticleById(id)
      .then((res) => {
        const data = res.data?.article;
        if (!data) { setNotFound(true); return; }
        setArticle(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!productsList.length) dispatch(fetchProducts());
  }, [dispatch, productsList.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-gray-400">文章載入中...</p>
      </div>
    );
  }

  if (notFound || !article) {
    return <NotFoundPage />;
  }

  const blocks = parseContent(article.content);
  const relatedProductIds = Array.isArray(article.relatedProducts) ? article.relatedProducts : [];
  const relatedProductsData = relatedProductIds
    .map(pid => productsList.find(p => p.id === pid))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <>
      {/* 封面圖片 */}
      {article.image && (
        <section className="relative w-full h-[480px]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </section>
      )}

      {/* 標題列 */}
      <section>
        <div className="p-8">
          <time className="text-secondary">
            {formatDate(article.create_at)}
          </time>
          <h1 className="text-3xl">{article.title}</h1>
        </div>
      </section>

      {/* 內文 */}
      <section>
        <div className="mx-auto max-w-screen-md space-y-8 p-8">
          
          {blocks.map((item, index) => {
            if (item.type === 'heading') {
              return (
                <h3 key={index} className="text-[1.35rem] font-semibold text-text-default leading-[1.4] pb-[0.4rem] border-b border-border">
                  {item.value}
                </h3>
              );
            }
            if (item.type === 'text' || item.type === 'paragraph') {
              return (
                <div key={index} className="flex flex-col gap-2">
                  {renderTextContent(item.value ?? item.text, "leading-[2] text-text-default")}
                </div>
              );
            }
            if (item.type === 'emphasis') {
              return (
                <blockquote key={index} className="font-serif text-lg text-secondary">
                  {item.value}
                </blockquote>
              );
            }
            if (item.type === 'image') {
              const imgSrc = item.url || item.src;
              return (
                <figure key={index} className="m-0">
                  <div className="w-full overflow-hidden rounded bg-panel">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.caption || ''}
                        className="w-full h-auto block object-cover"
                      />
                    ) : (
                      <div className="w-full h-60 flex items-center justify-center">
                        <span className="text-6xl opacity-20">🌿</span>
                      </div>
                    )}
                  </div>
                  {item.caption && (
                    <figcaption className="mt-2 text-[0.8rem] text-text-muted text-center">
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

      {/* 相關商品 + 返回 */}
      <section>
        <div className="border-t border-border py-12">
          <div className="max-w-screen-md mx-auto flex flex-col gap-16 p-8">
            {relatedProductsData.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3>相關商品</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {relatedProductsData.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="link-card">
                      <ProductCard {...product} usedOnPage="products" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <Link to="/articles">
              <button className="btn-panel text-xs">← 返回文章列表</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
