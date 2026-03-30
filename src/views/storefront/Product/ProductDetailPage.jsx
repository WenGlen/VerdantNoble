import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

import CareTipsSection from "../../../components/storefront/sections/products/CareTipsSection";
import QuantityController from "../../../components/storefront/elements/QuantityController";
import { useDispatch } from "react-redux";
import { addToCartWithStockCheck } from "../../../slices/cartSlice";
import { formatPrice } from "../../../utils/formatPrice";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(1);

  const getProduct = useCallback(async () => {
    if (!params.id) {
      setNotFound(true);
      setProduct({});
      setImages([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setNotFound(false);
    try {
      const res = await axios.get(
        `${VITE_API_URL}/api/${VITE_API_PATH}/product/${params.id}`,
      );
      if (res.data.product) {
        setProduct(res.data.product);
        setImages([
          res.data.product.imageUrl,
          ...(res.data.product.imagesUrl || []),
        ]);
        setNotFound(false);
        setSelectedImage(0);
      } else {
        setNotFound(true);
        setProduct({});
        setImages([]);
      }
    } catch {
      setNotFound(true);
      setProduct({});
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  // 解析 care JSON 字串 → 陣列
  const care = useMemo(() => {
    if (Array.isArray(product.care)) return product.care;
    if (typeof product.care === "string" && product.care.trim()) {
      try {
        return JSON.parse(product.care);
      } catch {
        return [];
      }
    }
    return [];
  }, [product.care]);

  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);

  async function handleAddToCart() {
    if (!product?.id) return;
    setCartLoading(true);
    try {
      await dispatch(
        addToCartWithStockCheck({
          productId: product.id,
          qty: quantity,
          stock: product.stock ?? undefined,
          unit: product.unit ?? "",
        }),
      ).unwrap();
    } catch {
      // over_limit or API error already toasts
    } finally {
      setCartLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-220px)] flex-1 flex-col-center-center ">
        載入中…
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="h-[calc(100vh-220px)] flex-1 flex-col-center-center">
        <p className="text-muted">找不到該商品，請檢查網址或返回商品列表。</p>
      </div>
    );
  }

  return (
    <div className="md:px-8">
      {/* Product Section */}
      <section className="pb-8 md:pt-8">
        {/*產品圖片*/}
        <div
          className="w-full max-h-[600px] overflow-hidden flex flex-col gap-4
                        md:flex-row-reverse "
        >
          <div className="w-full aspect-[4/3] bg-placeholder rounded-md overflow-hidden">
            <img
              src={images[selectedImage]}
              alt={`${product.title} — 圖 ${selectedImage + 1}`}
              className="block w-full h-full object-cover"
            />
          </div>

          <div
            className="flex justify-between gap-2 
                          md:flex-col md:w-1/4"
          >
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`p-0 w-1/4 aspect-[4/3] rounded-md overflow-hidden bg-placeholder hover:opacity-75 
                                    md:w-full 
                                    ${selectedImage === index ? "opacity-100" : "opacity-50"}`}
              >
                <img
                  src={img}
                  alt={`${product.title} — 縮圖 ${index + 1}`}
                  className="block w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-panel-50 p-8 rounded-md flex flex-col justify-between md:flex-row  gap-4">
        <div className="">
          <h1 className="text-xl md:text-2xl tracking-normal">
            {" "}
            {product.title}{" "}
          </h1>
          <div className="space-y-4 hidden md:block">
            <p className="text-secondary">{product.sub_title} </p>
            <div className="w-fit bg-panel rounded-md px-4 py-1 text-xs font-bold">
              {product.category}
            </div>
          </div>
        </div>

        <div className="min-w-[220px] flex flex-col gap-4">
          <div className="flex-row-between gap-2 ">
            <div className="h-full space-y-4 ">
              <p className="text-secondary block md:hidden">
                {product.sub_title}{" "}
              </p>
              <div className="bg-panel rounded-md px-3 py-1 text-xs font-bold block md:hidden">
                {product.category}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-right">
              {Number(product.origin_price) !== Number(product.price) && (
                <p className="text-sm md:text-base line-through text-muted">
                  $ {formatPrice(product.origin_price)}
                </p>
              )}
              <p className="text-xl font-bold text-primary">
                $ {formatPrice(product.price)}
              </p>
            </div>
          </div>
          <div className="flex-row--center justify-between md:justify-end gap-4">
            {product.category === "精品" ? (
              <p className="font-bold">唯一個體</p>
            ) : (
              <QuantityController
                value={quantity}
                min={1}
                max={product.stock}
                unit={product.unit}
                onChange={setQuantity}
              />
            )}
            <button
              type="button"
              className="btn-primary"
              disabled={cartLoading || !product?.id}
              onClick={handleAddToCart}
            >
              {cartLoading ? "加入中…" : "加入購物車"}
            </button>
          </div>
        </div>
      </section>

      <section className="px-8">
        <div className="max-w-[640px] mx-auto flex flex-col gap-8 py-12">
          {product.content && (
            <div className="text-md text-primary font-bold font-serif whitespace-pre-wrap">
              {product.content}
            </div>
          )}
          <div className="text-md  whitespace-pre-wrap">
            {product.description}
          </div>
          {product.story && (
            <div className="text-md whitespace-pre-wrap">
              <p className="text-secondary font-bold">綠爵故事</p>
              {product.story}
            </div>
          )}
        </div>
      </section>

      {care.length > 0 && (
        <section className="md:px-8">
          <div className="max-w-screen-md mx-auto py-8">
            <CareTipsSection title="養護重點" care={care} />
          </div>
        </section>
      )}
    </div>
  );
}
