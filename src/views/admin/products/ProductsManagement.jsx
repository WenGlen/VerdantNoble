import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

import ModButton from '../../../components/admin/elements/ModButton';
import FoucsPanel from '../../../components/admin/panels/FoucsPanel';
import EditPanel from '../../../components/admin/panels/EditPanel';
import ProductsList from '../../../components/admin/panels/ProductsList';

export default function ProductsManagement() {
    const [mod, setMod] = useState("view");
    const [products, setProducts] = useState([]);
    const [firstTimeLoading, setFirstTimeLoading] = useState(true);

    useEffect(() => {
        getProducts();
    }, []);

    async function getProducts() {
        setMod("get");
        setFocus({});
        try {
            const res = await axios.get(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/products/all`);
            if (res.data.products) {
                const resProducts = Object.values(res.data.products);
                resProducts.forEach(product => {
                    const imagesArray = product.imagesUrl || [];
                    product.imageUrl1 = imagesArray[0] || "";
                    product.imageUrl2 = imagesArray[1] || "";
                    product.imageUrl3 = imagesArray[2] || "";
                    product.imageUrl4 = imagesArray[3] || "";
                    product.imageUrl5 = imagesArray[4] || "";
                });
                const sortedProducts = sortProductsByCategoryAndTitle(resProducts);
                setProducts(sortedProducts);
                setFirstTimeLoading(false);
            } else {
                setProducts([]);
            }
        } catch (error) {
            setProducts([]);
        }
        setMod("view");
        resetEditingProduct();
    }

    function sortProductsByCategoryAndTitle(products) {
        const sortedProducts = [...products];
        sortedProducts.sort((a, b) => {
            const categoryA = a.category || '';
            const categoryB = b.category || '';
            const categoryCompare = categoryA.localeCompare(categoryB, 'zh-CN', {
                numeric: true,
                sensitivity: 'base'
            });
            if (categoryCompare === 0) {
                const titleA = a.title || '';
                const titleB = b.title || '';
                return titleA.localeCompare(titleB, 'zh-CN', {
                    numeric: true,
                    sensitivity: 'base'
                });
            }
            return categoryCompare;
        });
        return sortedProducts;
    }

    useEffect(() => {
        if (mod === "add") {
            resetEditingProduct();
        }
    }, [mod]);

    const [focus, setFocus] = useState({});
    const [deleteTargetId, setDeleteTargetId] = useState("");
    const [deleting, setDeleting] = useState(false);

    function DeleteMod(id) {
        setMod("delete");
        setDeleteTargetId(id);
    }

    async function deleteProduct(id) {
        setDeleting(true);
        try {
            await axios.delete(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/product/${id}`);
            getProducts();
            setFocus({});
            setMod("view");
            setDeleteTargetId("");
        } catch (error) {
            setMod("view");
        } finally {
            setDeleting(false);
        }
    }

    function handleCancelDelete() {
        setMod("view");
        setDeleteTargetId("");
    }

    const [editingProductIsEnabled, setEditingProductIsEnabled] = useState(1);
    const [editingProduct, setEditingProduct] = useState({});

    function resetEditingProduct() {
        setEditingProduct({
            title: "",
            sub_title: "",
            category: "",
            origin_price: 0,
            price: 0,
            unit: 0,
            description: "",
            content: "",
            is_enabled: 1,
            imageUrl: "",
            imageUrl1: "",
            imageUrl2: "",
            imageUrl3: "",
            imageUrl4: "",
            imageUrl5: "",
            stock: 0,
            soldQuantity: 0,
        });
        setEditingProductIsEnabled(1);
        setInputError("");
    }

    function eventHandlereditingProduct(e) {
        const { value, name } = e.target;
        setEditingProduct({
            ...editingProduct,
            [name]: name === "origin_price" || name === "price" || name === "stock" || name === "soldQuantity"
                ? parseInt(value) || 0
                : value
        });
    }

    function editProduct(item) {
        setFocus({ ...item });
        setMod("update");
        setEditingProduct({
            title: item.title || "",
            sub_title: item.sub_title || "",
            category: item.category || "",
            origin_price: item.origin_price || 0,
            price: item.price || 0,
            stock: item.stock || 0,
            soldQuantity: item.soldQuantity || 0,
            unit: item.unit || "個",
            description: item.description || "",
            content: item.content || "",
            is_enabled: item.is_enabled !== undefined ? item.is_enabled : 1,
            imageUrl: item.imageUrl || "",
            imageUrl1: item.imageUrl1 || "",
            imageUrl2: item.imageUrl2 || "",
            imageUrl3: item.imageUrl3 || "",
            imageUrl4: item.imageUrl4 || "",
            imageUrl5: item.imageUrl5 || "",
        });
        setEditingProductIsEnabled(item.is_enabled !== undefined ? item.is_enabled : 1);
        setInputError("");
    }

    const [uploading, setUploading] = useState(false);

    async function uploadProduct(mod) {
        if (mod !== "add" && mod !== "update") return;
        setUploading(true);
        setInputError("");
        const error = checkInputError();
        if (error !== "") {
            setUploading(false);
            setInputError(error);
            return;
        }
        const uploadItem = prepareProductData(editingProduct, editingProductIsEnabled);
        try {
            if (mod === "add") {
                await axios.post(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/product`, uploadItem);
            } else {
                await axios.put(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/product/${focus.id}`, uploadItem);
            }
            getProducts();
        } catch (error) {}
        setUploading(false);
    }

    const [inputError, setInputError] = useState("");
    const errorType = {
        empty: "有漏填資訊，請完整填寫",
        notNumber: "原價、售價、庫存請填寫純數字",
        negative: "原價、售價、庫存當中有負數資訊",
        discontError: "原價不能小於售價",
    };

    function checkInputError() {
        const excludeFields = ['sub_title', 'origin_price', 'price', 'stock', 'soldQuantity', 'imageUrl1', 'imageUrl2', 'imageUrl3', 'imageUrl4', 'imageUrl5'];
        for (const [key, value] of Object.entries(editingProduct)) {
            if (excludeFields.includes(key)) continue;
            if (value === "") return errorType.empty;
        }
        if (typeof editingProduct.origin_price !== "number" || typeof editingProduct.price !== "number" || typeof editingProduct.stock !== "number" || typeof editingProduct.soldQuantity !== "number") {
            return errorType.notNumber;
        }
        if (editingProduct.origin_price < 0 || editingProduct.price < 0 || editingProduct.stock < 0 || editingProduct.soldQuantity < 0) {
            return errorType.negative;
        }
        if (editingProduct.origin_price < editingProduct.price) {
            return errorType.discontError;
        }
        return "";
    }

    function prepareProductData(product, isEnabled) {
        const productCopy = { ...product };
        productCopy.is_enabled = isEnabled;
        const imagesUrlArray = [
            productCopy.imageUrl1,
            productCopy.imageUrl2,
            productCopy.imageUrl3,
            productCopy.imageUrl4,
            productCopy.imageUrl5
        ].filter(url => url && url.trim() !== "");
        const { imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, ...productData } = productCopy;
        return { data: { ...productData, imagesUrl: imagesUrlArray } };
    }

    return (
        <>
            {firstTimeLoading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-80 h-[300px] p-3 flex flex-col gap-6 justify-center items-center rounded-lg bg-admin-card-50 shadow-md">
                        <Oval height={80} width={80} color="var(--color-admin-text-hover)" secondaryColor="var(--color-admin-bg)" strokeWidth={6} />
                        <p className="text-sm text-center">資料讀取中...</p>
                    </div>
                </div>
            ) : (
                <div className="flex-row-between-center gap-6 pl-12">
                    <div /*先佔位之後再調排版*//>
                    <div className="h-[85vh] max-h-[85vh] w-fit p-6 rounded-lg bg-admin-card shadow-md flex flex-col gap-6">
                        <ProductsList
                            products={products}
                            mod={mod}
                            setFocus={setFocus}
                            deleteTargetId={deleteTargetId}
                            onDeleteMod={DeleteMod}
                            onCancelDelete={handleCancelDelete}
                            onConfirmDelete={deleteProduct}
                            deleting={deleting}
                            editProduct={editProduct}
                        />
                        <div className="flex justify-between mt-3.5">
                            <ModButton type="get" mod={mod} action={() => getProducts()} />
                            <ModButton type="add" mod={mod} action={() => setMod("add")} />
                        </div>
                    </div>

                    <div>
                        {mod !== "add" && mod !== "update" ? (
                            <FoucsPanel
                                focus={focus}
                                setFocus={setFocus}
                                editProduct={editProduct}
                                setMod={setMod}
                            />
                        ) : (
                            <EditPanel
                                editingProduct={editingProduct}
                                editingProductIsEnabled={editingProductIsEnabled}
                                setEditingProductIsEnabled={setEditingProductIsEnabled}
                                eventHandlereditingProduct={eventHandlereditingProduct}
                                mod={mod}
                                setMod={setMod}
                                setFocus={setFocus}
                                uploading={uploading}
                                resetEditingProduct={resetEditingProduct}
                                inputError={inputError}
                                uploadProduct={uploadProduct}
                                url={VITE_API_URL}
                                path={VITE_API_PATH}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
