import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ProductCard from '../../../components/storefront/elements/ProductCard';
import { addToCartWithStockCheck } from '../../../api/cart';
import { fetchProducts } from '../../../slices/productsSlice';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.products.list);
  const loading = useSelector((state) => state.products.loading);

  const categories = useMemo(
    () => [...new Set((list || []).map((p) => p.category).filter(Boolean))],
    [list]
  );

  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  // 進入商品頁時刷新列表
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // 預設選擇「精品」；若無則選第一個分類
  useEffect(() => {
    if (categories.length && !activeCategory) {
      const defaultCategory = categories.includes('精品') ? '精品' : categories[0];
      setActiveCategory(defaultCategory);
    }
  }, [categories, activeCategory]);

  const filteredProducts = activeCategory
    ? (list || []).filter((product) => product.category === activeCategory)
    : list || [];

  const handleAddToCart = (productId, qty = 1, stock = null, unit = '') => {
    addToCartWithStockCheck({ productId, qty, stock: stock ?? undefined, unit });
  };

  return (
    <div className="px-8">
      {/* Banner */}
      <section className="banner
                        py-12 flex-col gap-8 border-b border-border-50">
        <div>
          <h1>挑選你的<span className="text-primary"> 綠蕨飾</span></h1>
          <p>探索我們精心挑選的鹿角蕨系列</p>
          <p>從經典品種到珍稀標本級植株應有盡有</p>
          <p>切換分類按鈕尋找你心儀的植物</p>
        </div>

        <div /*tabs-container*/ className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`btn-tag font-serif text-lg tracking-wider ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <div>
        <section>
          <div className="flex-row-between-center mt-12 py-4">
            <span className="">
              {loading ? '載入中…' : `此分類 ${filteredProducts.length} 項商品`}
            </span>
            <div>
              <span>排序方式（功能還沒做）：</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">熱門度</option>
                <option value="price-low">價格：低到高</option>
                <option value="price-high">價格：高到低</option>
                <option value="newest">最新上架</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <div /*product-card-grid*/ className="grid gap-12
                                                grid-cols-1 
                                                sm:grid-cols-2 
                                                md:grid-cols-3 ">
            {loading && list.length === 0 ? (
              <p className="col-span-full text-muted">載入中…</p>
            ) : (
              filteredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="link-card">
                  <ProductCard
                    {...product}
                    usedOnPage="products"
                    onAddToCart={handleAddToCart}
                  />
                </Link>
              ))
            )}
          </div>
        </section>

        <div className="h-12"/>
      </div>
    </div>
  );
}
