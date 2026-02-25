import { Outlet, Link , NavLink , useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StorefrontToast from '../../components/storefront/elements/StorefrontToast';
import { EVENT_CART_UPDATED } from '../../api/cart';
import { fetchProducts } from '../../slices/productsSlice';
import { fetchCart, selectCartCount } from '../../slices/cartSlice';

import userIcon from '../../img/user.png';
import cartIcon from '../../img/cart.png';
import logo from '../../img/綠爵飾-480.png';
import logoEn from '../../img/Verdant Noble-480.png';

export default function MainLayout({ 

    headerNavItems ,
    footerNavItems ,

}) {
    const dispatch = useDispatch();
    const cartCount = useSelector(selectCartCount);
    {/* 換頁時回到頂部 */}
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);


    {/* 吐司彈窗：由 Redux storefrontToast 控管 */}
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    /** 從 cookie 判斷是否已登入（與 LoginPage 存的 GlenToken 一致） */
    function getLoginToken() {
        const match = document.cookie.match(/(?:^|;\s*)GlenToken=([^;]*)/);
        return match ? match[1].trim() : null;
    }

    const [isLoggedIn, setIsLoggedIn] = useState(() => !!getLoginToken());

    // 換頁時重新檢查登入狀態（從登入頁回來時會更新）
    useEffect(() => {
        setIsLoggedIn(!!getLoginToken());
    }, [location.pathname]);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    // 進站時預載產品列表（供首頁、商品頁使用）
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        const onCartUpdated = () => dispatch(fetchCart());
        window.addEventListener(EVENT_CART_UPDATED, onCartUpdated);
        return () => window.removeEventListener(EVENT_CART_UPDATED, onCartUpdated);
    }, [dispatch]);

    // 從手機版切回桌機版時關閉手機選單（Tailwind md = 768px）
    useEffect(() => {
        const media = window.matchMedia('(min-width: 768px)');
        const handler = () => {
            if (media.matches) setIsMobileMenuOpen(false);
        };
        media.addEventListener('change', handler);
        return () => media.removeEventListener('change', handler);
    }, []);

    return (
        <div className="min-h-screen flex flex-col w-full" >
            {/* 測試用 
            <div className="fixed bottom-0 left-0 z-50 text-[8px] text-white p-2 bg-black/50 rounded-tr-md  flex flex-row-between-center gap-2">
                <p>測試用</p>
                <p>isLoggedIn：{isLoggedIn ? 'true' : 'false'}</p>
                <button className="px-2 py-0 bg-black/50 rounded-md text-2xs" onClick={() => setIsLoggedIn(!isLoggedIn)}>{isLoggedIn ? '登出' : '登入'}</button>
            </div>
            */}

            <header className="header fixed top-0 left-0 right-0 z-50 w-full" >
                {/* 桌面版選單 */}
                <div className="relative w-full h-16 backdrop-blur-sm bg-background-50 border-b border-border-25 
                                hidden
                                md:block ">
                    <div className="w-full max-w-screen-xl mx-auto flex-row-between-center gap-4 py-2 px-8">
                        <Link to="/" className="flex-shrink-0" >
                            <img src={logo} alt="logo" className="h-12 -translate-y-1" />
                        </Link>

                        <div className="nav w-full max-w-[600px] md:min-w-[480px]
                                        flex justify-evenly
                                        text-lg" >
                        {headerNavItems.map((item) => (
                            <NavLink key={item.path} to={item.path}  
                                     className={item.path === location.pathname ? 'nav-item active' : 'nav-item'} >
                                {item.label}
                            </NavLink>
                        ))}
                        </div>

                        <div /*header-actions*/ className=" flex-row-center-center gap-4 py-2 flex-shrink-0">
                            <Link to="/order" className="btn-icon relative">
                                <img src={cartIcon} alt="cart" className="w-8 h-8" />
                                {cartCount > 0 && (
                                    <div className="absolute -top-3 -right-3
                                                    w-6 h-6 bg-primary rounded-full
                                                    text-xs text-invert flex items-center justify-center ">
                                        {cartCount}
                                    </div>
                                )}
                            </Link>
                            <Link
                                to="/user/orders"
                                className="btn-icon"
                            >
                                <img src={userIcon} alt="user" className="w-10 h-10" />
                            </Link>
                        </div>
                    </div>

                    {/* 吐司彈窗：由 Redux storefrontToast 顯示 */}
                    <div className="absolute -bottom-[300px] right-4 z-50">
                        <StorefrontToast />
                    </div>

                </div>
                
                {/* 手機版選單 */}
                <div className="fixed top-4 right-4 flex gap-6 z-50
                                                block
                                                md:hidden">

                    <Link to="/order" className="btn-icon relative">
                        <img src={cartIcon} alt="cart" className="w-8 h-8" />
                        {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2
                                        w-6 h-6 bg-primary rounded-full
                                        text-sm text-invert flex items-center justify-center ">
                            {cartCount}
                        </span>
                        )}
                    </Link>

                    <button className="btn-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <div className="w-8 h-8 flex-col-center
                                        bg-muted rounded-md pb-1">
                            <span className="text-lg text-invert ">☰</span>
                        </div>
                    </button>

                    <div className="fixed top-0 left-4 z-50">
                        <StorefrontToast />
                    </div>

                </div>

                <div className={`fixed top-0 right-0 z-40 w-full h-full 
                                bg-background-75 backdrop-blur-sm 
                                transition-all duration-300
                                ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
                        <div className="w-full h-24"/>
                        <div className="w-full px-8 flex-col-center-end gap-8">
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <Link to="/" className="" >
                                    <img src={logo} alt="logo" className="w-36" />
                                </Link>
                            </button>
                            <button className="flex-col-center-center gap-8" onClick={() => setIsMobileMenuOpen(false)}>
                                {headerNavItems.map((item) => (
                                    <NavLink key={item.path} to={item.path} 
                                             className={`nav-item text-lg text-NotoSerifTC ${item.path === location.pathname ? 'text-secondary' : ''}`}>
                                        {item.label}
                                    </NavLink>
                                ))}
                                <NavLink
                                    to="/user/orders"
                                    className={`nav-item text-lg text-NotoSerifTC`}
                                >
                                    我的訂單
                                </NavLink>
                            </button>
                        </div>
                </div>
                

            </header>

            
            {/* 主要內容（md:pt-16 是避免被固定 header 遮住*/}
            <div className="flex-1 w-full min-h-0 md:pt-16">
                <main className="mx-auto w-full" >
                    <Outlet context={{ isLoggedIn }} />
                </main>
            </div>


            <footer className="w-full backdrop-blur-sm bg-background-25
                                border-t border-border-50">
                <div className="w-full max-w-screen-xl mx-auto 
                                    flex-col-center-center gap-4
                                    px-8 py-4 ">

                    <div className="w-full flex flex-col justify-between items-center gap-8
                                    md:flex-row">

                    {/* EDM */}
                    <div className="w-full flex flex-col md:flex-row items-center md:gap-8">
                        <div className="flex-shrink-0">
                            <img src={logoEn} alt="logo" className="w-40" />
                        </div>

                        <form className="w-full flex-col-start gap-2 text-xs">
                        <p>訂閱綠爵飾電子報<br />專為綠蕨愛好者提供優質的植物和相關資訊。</p>
                        <div className="w-full flex-row-start">
                            <input
                            type="email"
                            placeholder="Email address"
                            className="w-full md:w-48 p-2 border-0 rounded-none
                                        shadow-[inset_0_-1px_0_0_var(--color-border)]
                                        focus:shadow-[inset_0_-2px_0_0_var(--color-border)] focus:outline-none"
                            />
                            <button className="btn-panel rounded-l-none rounded-r-sm w-24">訂閱</button>
                        </div>
                        </form>

                    </div>

                    {/* 頁尾選單 */}
                    <div className="flex-row-between gap-8">
                        <div className="w-[160px] md:w-[100px] space-y-2 text-center md:text-left">
                        <p>探索綠爵飾</p>
                        <ul className="space-y-1">
                            {headerNavItems.map((item, index) => (
                            <li key={index}>
                                <NavLink key={item.path} to={item.path} 
                                        className={`nav-item text-NotoSerifTC`}>
                                {item.label}
                                </NavLink>
                            </li>
                            ))}
                        </ul>
                        </div>

                        <div className="w-[160px] md:w-[100px] space-y-2 text-center md:text-left">
                        <p>了解更多</p>
                        <ul className="space-y-1">
                            {footerNavItems.map((item, index) => (
                            <li key={index}>
                                <NavLink key={item.path} to={item.path} 
                                        className={`nav-item text-NotoSerifTC`}>
                                {item.label}
                                </NavLink>
                            </li>
                            ))}
                            <li><br /></li>
                            <li>    
                                <NavLink
                                    to="/login"
                                    className={`nav-item text-NotoSerifTC`}
                                >
                                    後台登入
                                </NavLink>
                            </li>
                        </ul>
                        </div>
                    </div>
                    </div>
                    {/* 版權宣告 */}
                    <div className="text-sm text-muted">
                    <p>© 2026 Verdant Noble.<br className="block md:hidden" /> ALL RIGHTS RESERVED.</p>
                    </div>
                </div>
                </footer>

        </div>
    )
}