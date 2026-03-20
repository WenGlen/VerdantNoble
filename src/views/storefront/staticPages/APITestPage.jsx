import { useState, useEffect } from 'react';


import axios from 'axios';
const { VITE_API_URL , VITE_API_PATH } = import.meta.env;

import ProductCard from '../../../components/storefront/elements/ProductCard'
import { Link } from 'react-router-dom';


export default function APITestPage() {

    const [products, setProducts] = useState([]);


    async function getProducts() {
        try {            
            const res = await axios.get (`${VITE_API_URL}/api/${VITE_API_PATH}/products/all`);
            if (res.data.products.length) {
                const  resProducts  = Object.values(res.data.products);
                setProducts(resProducts);
            } else {
  
                setProducts([]);
            }
        } catch {
            setProducts([]); 
        }
    }
    const productId = '-OiBEbTwpk0POvaePYLs';
    const [product, setProduct] = useState([]);
    async function getProducById(id) {
        try {            
            const res = await axios.get (`${VITE_API_URL}/api/${VITE_API_PATH}/product/${id}`);
            if (res.data.product) {
                const  resProduct  = res.data.product;
                setProduct(resProduct);
            } else {
  
                setProduct(null);
            }
        } catch {
            setProduct(null); 
        }
    }
  
    useEffect(() => {
      queueMicrotask(() => {
        getProducts();
        getProducById(productId);
      });
    }, []);




    return (
        <>
            <h1>API測試</h1>
            <h2 className="text-2xl font-bold">綠爵飾 Verdant Noble</h2>

            <section>
                <h3>單一產品</h3>
                <div className="text-xs p-12">
                    <div /*product-card-grid*/ className="grid gap-12 grid-cols-4">
                      {JSON.stringify(product)}
                    </div>
                </div>
            </section>


            <section>
                <h3>產品表</h3>
                <div className="text-xs p-12">
                    <div /*product-card-grid*/ className="grid gap-12 grid-cols-4">
                      {JSON.stringify(products)}
                    </div>
                </div>
            </section>


        </>
    );
}