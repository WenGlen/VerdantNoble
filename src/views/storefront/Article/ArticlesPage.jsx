import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ArticleCard from '../../../components/storefront/elements/ArticleCard';
import Pagination from '../../../components/storefront/elements/Pagination';
import { fetchArticles } from '../../../slices/articlesSlice';

const ITEMS_PER_PAGE = 4;

function isFeatured(article) {
  return Array.isArray(article.tag)
    ? article.tag.includes('精選')
    : article.is_featured === true;
}

export default function ArticlesPage() {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.articles.list);
  const loading = useSelector((state) => state.articles.loading);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  // 精選文章（最新一篇有「精選」tag；若無則取最新一篇）
  const featuredArticle = useMemo(() => {
    if (!list.length) return null;
    const featured = list.filter(isFeatured);
    const pool = featured.length ? featured : list;
    return [...pool].sort((a, b) => (b.create_at || 0) - (a.create_at || 0))[0];
  }, [list]);

  // 從所有文章的 tag 陣列取出所有不重複標籤
  const allTags = useMemo(() => {
    const tagSet = new Set();
    list.forEach((article) => {
      if (Array.isArray(article.tag)) {
        article.tag.forEach((t) => tagSet.add(t));
      }
    });
    return [...tagSet];
  }, [list]);

  // 篩選（排除精選文章、依搜尋詞、依標籤）
  const filteredArticles = useMemo(() => {
    let filtered = featuredArticle
      ? list.filter((a) => a.id !== featuredArticle.id)
      : [...list];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((a) =>
        a.title?.toLowerCase().includes(term) ||
        a.description?.toLowerCase().includes(term)
      );
    }

    if (activeTag) {
      filtered = filtered.filter((a) =>
        Array.isArray(a.tag) && a.tag.includes(activeTag)
      );
    }

    return filtered;
  }, [list, featuredArticle, searchTerm, activeTag]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function handleSearch(e) {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  function handleTagClick(tag) {
    setActiveTag((prev) => (prev === tag ? null : tag));
    setCurrentPage(1);
  }

  function handlePrevious() {
    if (currentPage > 1) { setCurrentPage((p) => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }
  function handleNext() {
    if (currentPage < totalPages) { setCurrentPage((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }
  function handlePageClick(page) {
    setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      {/* 精選文章 Banner */}
      {featuredArticle && (
        <section className="relative w-full h-[480px]">
          <div className="w-full h-full">
            {featuredArticle.image ? (
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-panel to-primary-50" />
            )}
          </div>

          <div className="absolute top-0 left-0 w-full h-full z-10">
            <div className="w-[40%] h-full bg-gradient-to-r from-overlay to-overlay-75" />
          </div>

          <div className="absolute bottom-0 left-0 z-20 w-full p-12">
            <div className="w-full md:w-[35%] py-12">
              <span className="text-secondary">精選故事</span>
              <h2 className="text-white">{featuredArticle.title}</h2>
              <p className="text-panel">{featuredArticle.description}</p>
            </div>
            <Link to={`/articles/${featuredArticle.id}`}>
              <button className="btn-muted">閱讀文章 →</button>
            </Link>
          </div>
        </section>
      )}

      <div className="px-8">
        <section className="w-full flex flex-col-reverse md:flex-row md:py-16 gap-8">

          {/* 文章列表 */}
          <div className="w-full md:w-[80%] space-y-8">
            <div className="w-full border-b border-border-50">
              <h1 className="text-2xl">綠蕨故事</h1>
            </div>

            {loading ? (
              <div className="col-span-2 text-center text-sm text-gray-500 my-8">
                <p>文章載入中...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {currentArticles.length > 0 ? (
                  currentArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                ) : (
                  <div className="col-span-2 text-center text-sm text-gray-500 my-8">
                    <p>沒有找到相關文章</p>
                  </div>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onPageClick={handlePageClick}
              />
            )}
          </div>

          {/* 分隔線 */}
          <div className="h-full w-px bg-primary-75 hidden md:block" />

          {/* 篩選器 */}
          <aside className="w-full md:w-[20%] min-w-[120px]">
            <div className="flex-col gap-4 md:gap-12 pt-8">
              {/* 搜尋 */}
              <div className="relative flex-row-start-center gap-2">
                <svg className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="搜尋文章..."
                  className="w-full pl-8 p-2 border-0 bg-transparent text-sm rounded-none
                             shadow-[inset_0_-1px_0_0_var(--color-border)]
                             focus:shadow-[inset_0_-2px_0_0_var(--color-border)] focus:outline-none"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              {/* 標籤 */}
              {allTags.length > 0 && (
                <div className="space-y-2 py-4">
                  <h3 className="text-sm">故事標籤</h3>
                  <div className="flex flex-row flex-wrap md:flex-col gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        className={`btn-tag text-xs font-bold ${activeTag === tag ? 'active' : ''}`}
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

        </section>
      </div>
    </>
  );
}
