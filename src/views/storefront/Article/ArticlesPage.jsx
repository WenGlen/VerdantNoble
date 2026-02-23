import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../../../components/storefront/elements/ArticleCard';


import Pagination from '../../../components/storefront/elements/Pagination';
import { articles } from '../../../data/articles';
import { getPopularTags } from '../../../data/articles';



const ITEMS_PER_PAGE = 4; // 每页显示4篇文章（2x2网格）

export default function ArticlesPage() {

  // 找最新的一篇精選文章
  const latestFeaturedArticle = useMemo(() => {
    // 先找出所有精選文章
    const featuredArticles = articles.filter(article => article.is_featured);
    
    if (featuredArticles.length > 0) {
      // 按發布日期由新到舊排序，然後取最新的
      return featuredArticles.sort((a, b) => 
        new Date(b.published_at) - new Date(a.published_at)
      )[0];
    }
    
    // 如果沒有精選文章，則返回最新的一篇
    return articles.sort((a, b) => 
      new Date(b.published_at) - new Date(a.published_at)
    )[0];
  }, []);





  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState(null);

  // 找最新的一篇精選文章
  const featuredArticle = useMemo(() => {
    // 先找出所有精選文章
    const featuredArticles = articles.filter(article => article.is_featured);
    
    if (featuredArticles.length > 0) {
      // 按發布日期由新到舊排序，然後取最新的
      return featuredArticles.sort((a, b) => 
        new Date(b.published_at) - new Date(a.published_at)
      )[0];
    }
    
    // 如果沒有精選文章，則返回最新的一篇
    return articles.sort((a, b) => 
      new Date(b.published_at) - new Date(a.published_at)
    )[0];
  }, []);





  // 过滤文章（排除精选文章）
  const filteredArticles = useMemo(() => {
    let filtered = articles.filter(article => article.id !== featuredArticle.id);

    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term) ||
        (article.category && article.category.toLowerCase().includes(term))
      );
    }

    // 按标签过滤
    if (activeTag) {
      filtered = filtered.filter(article => article.category === activeTag);
    }

    return filtered;
  }, [searchTerm, activeTag, featuredArticle.id]);

  // 分页
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // 重置到第一页
  };

  const handleTagClick = (tag) => {
    if (activeTag === tag) {
      setActiveTag(null); // 如果点击已激活的标签，则取消过滤
    } else {
      setActiveTag(tag);
    }
    setCurrentPage(1); // 重置到第一页
  };



  const tags = getPopularTags();


  return (

    <>
      {/*精選文章區*/}
      {latestFeaturedArticle && (

        <section className="relative w-full h-[480px]">
          <div className="w-full h-full">
            {latestFeaturedArticle.cover_image?.src ? (
              <img 
                src={latestFeaturedArticle.cover_image.src} 
                alt={latestFeaturedArticle.cover_image.alt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-panel to-primary-50" />
            )}
          </div>

          <div className="absolute top-0 left-0 w-full h-full z-10 flex-row">
            <div className="w-[40%] h-full bg-gradient-to-r from-overlay to-overlay-75" />
            <div className="w-[60%] h-full bg-gradient-to-r from-overlay-75 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 z-20 
                          w-full p-12">
            <div className="w-full md:w-[40%] py-12">
            <span className="text-secondary">精選故事</span>
            <h2 className="text-white">{latestFeaturedArticle.title}</h2>
            <p className="text-panel">{latestFeaturedArticle.excerpt}</p>
            </div>
            
            <Link to={`/articles/${latestFeaturedArticle.slug}`} className="">
              <button className="btn-muted">
                閱讀文章 →
              </button>
            </Link>

          </div>
        </section>
      )}

      <div className="px-8">
      {/*文章區*/}
        <section className="w-full flex flex-col-reverse md:flex-row md:py-16 gap-8">
          
          {/*文章列表區*/}
          <div className="w-full md:w-[80%] space-y-8 ">
            <div className="w-full border-b border-border-50">
              <h1 className="text-2xl">綠蕨故事</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
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

          {/*分隔線*/}
          <div className="h-full w-px bg-primary-75 hidden md:block"/>
          
          {/*文章篩選器*/}
          <aside className="w-full md:w-[20%] min-w-[120px] ">
            <div className="flex-col gap-4 md:gap-12 pt-8  ">

              {/*搜尋*/}
              <div className="relative flex-row-start-center gap-2">
                <svg className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2"  viewBox="0 0 20 20" fill="none">
                  <path 
                    d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="搜尋文章..."
                  className="w-full pl-8 p-2 border-0 bg-transparent text-sm rounded-none
                            shadow-[inset_0_-1px_0_0_var(--color-border)]
                            focus:shadow-[inset_0_-2px_0_0_var(--color-border)] focus:outline-none"
                  value={searchTerm} onChange={handleSearch}
                />
              </div>
              {/*標籤*/}
              <div>
                <h3 className="text-sm">故事標籤</h3>
                <div className="flex-row flex-wrap md:flex-col gap-2">
                  {tags.map((tag) => (
                    <button key={tag} className={`btn-tag text-xs font-bold ${activeTag === tag ? 'active' : ''}`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>



        </section>
      </div>

    </>
  );
}

