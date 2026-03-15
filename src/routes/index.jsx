import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';

import DocumentTitle from './DocumentTitle';

import MainLayout from '../views/storefront/MainLayout.jsx';

import HomePage from '../views/storefront/HomePage.jsx';


import ProductsPage from '../views/storefront/Product/ProductsPage.jsx';
import ProductDetailPage from '../views/storefront/Product/ProductDetailPage.jsx';
import ArticlesPage from '../views/storefront/Article/ArticlesPage.jsx';
import ArticleDetailPage from '../views/storefront/Article/ArticleDetailPage.jsx';
import AboutPage from '../views/storefront/AboutPage.jsx';
import ContactPage from '../views/storefront/ContactPage.jsx';

import OrderLayout from '../views/storefront/Order/OrderLayout.jsx';

import UserLayout from '../views/storefront/User/UserLayout.jsx';
import InfoPage from '../views/storefront/User/InfoPage.jsx';
import OrdersPage from '../views/storefront/User/OrdersPage.jsx';

import PrivacyPage from '../views/storefront/staticPages/PrivacyPage.jsx';
import FAQPage from '../views/storefront/staticPages/FAQPage.jsx';
import NotFoundPage from '../views/storefront/staticPages/NotFoundPage.jsx';
import APITestPage from '../views/storefront/staticPages/APITestPage.jsx';

// 後台頁面
import AdminLoginPage from '../views/admin/AdminLoginPage.jsx';

import AdminLayout from '../views/admin/AdminLayout.jsx';
import AdminHomePage from '../views/admin/AdminHomePage.jsx';

import ProductsManagement from '../views/admin/ProductsManagement/ProductsManagement.jsx';
import ProductsMark from '../views/admin/ProductsManagement/ProductsMark.jsx';
import ArticlesManagement from '../views/admin/ArticlesManagement/ArticlesManagement.jsx';
import ArticlesMark from '../views/admin/ArticlesManagement/ArticlesMark.jsx';
import OrdersList from '../views/admin/OrdersManagement/OrdersList.jsx';

import ArticlesListIcon from '../img/ArticlesList.png';
import ArticlesMarkIcon from '../img/ArticlesMark.png';
import ProductsListIcon from '../img/ProductsList.png';
import ProductsMarkIcon from '../img/ProductsMark.png';
import OrdersListIcon from '../img/OrdersList.png';

// 頁面標題集中管理（顯示為：title | 綠蕨飾）

// 前台頁面
const storefrontPages = {

    headerNav:[
        { path: "products", element: <ProductsPage />, title:'挑選綠蕨'  },
        { path: "articles", element: <ArticlesPage />, title: '綠爵養護' },
        { path: "about", element: <AboutPage />, title: '關於我們' },
        { path: "contact", element: <ContactPage />, title: '聯絡我們' },
    ],
    details:[
        { path: "product/:id", element: <ProductDetailPage />, title: '商品詳情' },
        { path: "articles/:id", element: <ArticleDetailPage />, title: '文章' },
    ],
    footerNav:[
        { path: "faq", element: <FAQPage />, title: '常見問題' },
        { path: "privacy", element: <PrivacyPage />, title: '隱私權政策' },
    ],
    order:[
        { path: "order", element: <OrderLayout />, title: '購物車' },
    ],
    // user使用者頁面有巢狀結構，直接寫在下面
    notFound:[
        { path: "*", element: <NotFoundPage />, title: '頁面不存在' },
    ],
    APITest:[
        { path: "api-test", element: <APITestPage />, title: 'API測試' },
    ],
};

const headerNavItems = storefrontPages.headerNav.map((item) => ({
    label: item.title,
    path: "/" + item.path  // 導航連結需絕對路徑
}));

const footerNavItems = storefrontPages.footerNav.map((item) => ({
    label: item.title,
    path: "/" + item.path,  // 導航連結需絕對路徑
}));

// 後台頁面
const adminPages =[
    { path: "ProductsManagement", element: <ProductsManagement />, title: '商品列表', icon: ProductsListIcon },
    { path: "ProductsMark", element: <ProductsMark />, title: '商品標籤', icon: ProductsMarkIcon },
    { path: "ArticlesManagement", element: <ArticlesManagement />, title: '文章列表', icon: ArticlesListIcon },
    { path: "ArticlesMark", element: <ArticlesMark />, title: '文章標籤', icon: ArticlesMarkIcon },
    { path: "OrdersList", element: <OrdersList />, title: '訂單列表', icon: OrdersListIcon },
];

const adminPagesItems = adminPages.map((item) => ({
    label: item.title,
    path: "/admin/" + item.path,  // 導航連結需絕對路徑
    icon: item.icon,
}));


function RootLayout() {
    return (
      <Fragment>
        <DocumentTitle />
        <Outlet />
      </Fragment>
    );
  }

export default function routes() {
    return [
        {
            element: <RootLayout />,
            children: [
                {
                    path: '/',
                    element: <MainLayout headerNavItems={headerNavItems} footerNavItems={footerNavItems} />,
                    children: [
                        {
                            index: true,
                            element: <HomePage />,
                            handle: { title: '' },
                        },
                        ...Object.values(storefrontPages).flatMap((routes) =>
                            routes.map((item) => ({
                                path: item.path,
                                element: item.element,
                                handle: { title: item.title },
                            }))
                        ),
                        {
                            path: "user",
                            element: <UserLayout />,
                            children: [
                                {
                                    path: "orders",
                                    element: <OrdersPage />,
                                    handle: { title: '查看訂單' },
                                },
                                {
                                    path: "info",
                                    element: <InfoPage />,
                                    handle: { title: '會員資料' },
                                },
                            ],
                        },
                    ],
                },
                {
                    path: "/login",
                    element: <AdminLoginPage />,
                    handle: { title: '後台登入' },
                },
                {
                    path: '/admin',
                    element: <AdminLayout adminPagesItems={adminPagesItems} />,
                    children: [
                        {
                            index: true,
                            element: <AdminHomePage />,
                            handle: { title: '後台首頁' },
                        },
                        ...adminPages.map((item) => ({
                            path: item.path,
                            element: item.element,
                            handle: { title: item.title },
                        })),
                    ],
                },
            ],
        },
    ];
}