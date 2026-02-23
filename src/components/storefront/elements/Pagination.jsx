export default function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPrevious, 
  onNext,
  onPageClick
}) {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  if (totalPages <= 1) return null;

  // 生成頁碼數組
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3; // 最多顯示3個頁碼
    
    if (totalPages <= maxVisible) {
      // 如果总页数少于等于3，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 否則顯示當前頁附近的頁碼
      if (currentPage === 1) {
        pages.push(1, 2, 3);
      } else if (currentPage === totalPages) {
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex-row-center-center gap-2 pb-12">
      <button
        className="btn-icon disabled:opacity-30"
        onClick={onPrevious}
        disabled={!hasPrevious}
        aria-label="上一页"
      >
        ‹ 上一頁
      </button>
      <div className="flex-row-start-center gap-1">
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`btn-pagination ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageClick && onPageClick(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        className="btn-icon disabled:opacity-30"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="下一页"
      >
        下一頁 ›

      </button>
    </nav>
  );
}

