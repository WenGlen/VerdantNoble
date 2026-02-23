import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Hero from '../../components/storefront/sections/Home/Hero';
import Introduce from '../../components/storefront/sections/Home/Introduce';
import Features from '../../components/storefront/sections/Home/Features';

import ProductCard from '../../components/storefront/elements/ProductCard';
import { addToCartWithStockCheck } from '../../api/cart';

import axios from 'axios';
const { VITE_API_URL, VITE_API_PATH } = import.meta.env;



export default function HomePage() {
  const [products, setProducts] = useState([]);

  async function getProducts() {
    try {            
        const res = await axios.get (`${VITE_API_URL}/api/${VITE_API_PATH}/products/all`);

        if (res.data.products.length) {
            const  resProducts  = Object.values(res.data.products).filter((product) => product.category === "精品");
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

  // 取得價位前四高的商品
  const topFourProducts = React.useMemo(() => {
    return [...products]
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 4);
  }, [products]);

  const handleAddToCart = (productId, qty = 1, stock = null, unit = '') => {
    addToCartWithStockCheck({ productId, qty, stock: stock ?? undefined, unit });
  };




  return (
    <>

      {/* 首頁英雄區 */}
      <Hero />

      <div className="w-full h-12"/>

      {/* 精選商品區 */}
      <div className="w-full bg-panel-50 py-20 mx-0">
        <section className="px-6">
          <div className="flex-row-between-end mb-10">
            <div>
              <h2 className="">優質精品</h2>
              <p className="text-sm text-textDefaultColor">我們精心挑選的健康、充滿活力的蕨類貴族</p>
            </div>
            <Link to="/products">
              <button className="btn-panel text-xs w-32">
              查看全部 →
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {topFourProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                usedOnPage="home"
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      </div>


      <div className="w-full h-12"/>
      

      {/* 介紹區 */}
      <Introduce />

      <Features />


    </>
  );
};
