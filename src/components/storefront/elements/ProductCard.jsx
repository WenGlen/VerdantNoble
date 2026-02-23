export default function ProductCard({
  id,
  title,
  imageUrl,
  origin_price,
  price,
  sub_title,
  usedOnPage,
  onAddToCart,
  stock,
  unit = '',
}) {
  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onAddToCart === 'function') onAddToCart(id, 1, stock, unit);
  };

  return (
    <div className={`${usedOnPage === 'home' ? '' : 'w-full'}
                    flex-col-start gap-2 hover:translate-y-[-6px] transition-all duration-200`}>
      {/* 圖片區域 */}
      <div className={`relative w-full
                      aspect-square rounded-md overflow-hidden`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-md flex items-center justify-center text-gray-500">
            <span>🌿</span>
          </div>
        )}
      </div>

      {/* 內容區域 */}
      <div className="w-full flex-col-start gap-2">
        <h3 className="text-md font-bold text-textDefaultColor">{title}</h3>
        <div className="flex-row-between-center">
          {sub_title ? (
            <span className="text-sm text-secondary">{sub_title}</span>
          ) : (
            <div />
          )}
          <div className="flex-row-end-end gap-2 text-2xs items-baseline">
            {price != origin_price && usedOnPage === 'products' && (
              <p className="text-muted line-through">NT${origin_price}</p>
            )}
            <p className="text-primary font-bold">NT$<span className="text-sm">{price}</span></p>
          </div>
        </div>
        {onAddToCart && (
          <button
            type="button"
            className="btn btn-panel text-xs mt-1 w-full"
            onClick={handleAddClick}
          >
            加入購物車
          </button>
        )}
      </div>
    </div>
  );
}

