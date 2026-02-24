import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Hero from '../../components/storefront/sections/Home/Hero';
import Introduce from '../../components/storefront/sections/Home/Introduce';
import Features from '../../components/storefront/sections/Home/Features';

import ProductCard from '../../components/storefront/elements/ProductCard';
import { addToCartWithStockCheck } from '../../api/cart';

export default function HomePage() {
  const list = useSelector((state) => state.products.list ?? []);

  // 精品、價位前四高
  const topFourProducts = useMemo(() => {
    return [...list]
      .filter((product) => product.category === '精品')
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 4);
  }, [list]);

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
}
