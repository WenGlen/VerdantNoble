import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

import ProductCard from '../../../components/storefront/elements/ProductCard';
import { addToCartWithStockCheck } from '../../../api/cart';



export default function ProductsPage() {


  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  async function getProducts() {
      try {            
          const res = await axios.get (`${VITE_API_URL}/api/${VITE_API_PATH}/products/all`);
          //console.log("res:",res);
          if (res.data.products.length) {
              const  resProducts  = Object.values(res.data.products);
              //console.log("resProducts:",resProducts);
              const resCategories = [...new Set(resProducts.map((product) => product.category))];
              //console.log("resCategories:",resCategories);
              setCategories(resCategories);

              // 對產品進行排序：先按分類排序，再按標題排序
              //const sortedProducts = sortProductsByCategoryAndTitle(resProducts);
              setProducts(resProducts);
          } else {

              setProducts([]);
          }
      } catch (error) {
          setProducts([]); 
      }
  }
  

  useEffect(() => {
    getProducts();
  }, []);

  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  // 預設選擇「精品」；若無則選第一個分類
  useEffect(() => {
    if (categories.length) {
      const defaultCategory = categories.includes('精品') ? '精品' : categories[0];
      setActiveCategory(defaultCategory);
    }
  }, [categories]);

  // 依目前分類篩選產品
  const filteredProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

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
            此分類 {filteredProducts.length} 項商品
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
            {filteredProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="link-card">
                  <ProductCard
                    {...product}
                    usedOnPage="products"
                    onAddToCart={handleAddToCart}
                  />
                </Link>
            ))}
          </div>
      </section>

      <div className="h-12"/>

    </div>


    </div>
  );
};

