import React, { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Hero from '../../components/storefront/sections/Home/Hero';
import Introduce from '../../components/storefront/sections/Home/Introduce';
import Features from '../../components/storefront/sections/Home/Features';

import ProductCard from '../../components/storefront/elements/ProductCard';
import { addToCartWithStockCheck } from '../../slices/cartSlice';
import { fetchProducts } from '../../slices/productsSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.products.list ?? []);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // 依後台設定的精選排序（is_featured 1~4）顯示商品，有幾個顯示幾個
  const topFourProducts = useMemo(() => {
    return [...list]
      .filter((p) => {
        const val = p.is_featured;
        // 相容舊 boolean 格式與新 number 格式
        return (typeof val === 'number' && val >= 1) || val === true;
      })
      .sort((a, b) => {
        const aVal = typeof a.is_featured === 'number' ? a.is_featured : 1;
        const bVal = typeof b.is_featured === 'number' ? b.is_featured : 1;
        return aVal - bVal;
      })
      .slice(0, 4);
  }, [list]);

  const handleAddToCart = (productId, qty = 1, stock = null, unit = '') => {
    dispatch(addToCartWithStockCheck({ productId, qty, stock: stock ?? undefined, unit }));
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

          <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-6">
            {topFourProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} >
                <ProductCard
                  key={product.id}
                  {...product}
                  usedOnPage="home"
                  onAddToCart={handleAddToCart}
                />
               </Link>
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
