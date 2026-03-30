import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import ProductCard from "../../../components/storefront/elements/ProductCard";
import { addToCartWithStockCheck } from "../../../slices/cartSlice";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.products.list);
  const loading = useSelector((state) => state.products.loading);

  const categories = useMemo(
    () => [...new Set((list || []).map((p) => p.category).filter(Boolean))],
    [list],
  );

  const [activeCategory, setActiveCategory] = useState("");

  const resolvedCategory = useMemo(() => {
    if (!categories.length) return "";
    if (activeCategory && categories.includes(activeCategory))
      return activeCategory;
    return categories.includes("精品") ? "精品" : categories[0];
  }, [categories, activeCategory]);

  const filteredProducts = resolvedCategory
    ? (list || []).filter((product) => product.category === resolvedCategory)
    : list || [];

  const handleAddToCart = (productId, qty = 1, stock = null, unit = "") => {
    dispatch(
      addToCartWithStockCheck({
        productId,
        qty,
        stock: stock ?? undefined,
        unit,
      }),
    );
  };

  return (
    <div className="px-8">
      {/* Banner */}
      <section
        className="banner
                        py-12 flex flex-col gap-4 border-b border-border-50"
      >
        <div>
          <h1>
            挑選你的<span className="text-primary"> 綠蕨飾</span>
          </h1>
          <p>探索我們精心挑選的鹿角蕨系列</p>
          <p>從經典品種到珍稀標本級植株應有盡有</p>
          <p>切換分類按鈕尋找你心儀的植物</p>
        </div>

        <div /*tabs-container*/ className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`btn-tag font-serif text-lg tracking-wider ${resolvedCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div>
          <span className="">
            {loading ? "載入中…" : `此分類 ${filteredProducts.length} 項商品`}
          </span>
        </div>
      </section>

      <div className="py-8">
        <section>
          <div
            /*product-card-grid*/ className="grid gap-12
                                                grid-cols-1 
                                                sm:grid-cols-2 
                                                md:grid-cols-3 "
          >
            {loading && list.length === 0 ? (
              <p className="col-span-full text-muted">載入中…</p>
            ) : (
              filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="link-card"
                >
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

        <div className="h-12" />
      </div>
    </div>
  );
}
