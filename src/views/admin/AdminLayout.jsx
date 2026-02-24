import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import DashboardToast from '../../components/admin/elements/DashboardToast';

export default function AdminLayout({ adminPagesItems = [] }) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        setAuthToken();
    }, []);

    function setAuthToken() {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)GlenToken\s*=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }

    useEffect(() => {
        const row = document.cookie.split('; ').find(row => row.startsWith('GlenToken='));
        const token = row ? row.split('=')[1] : null;
        setIsLoggedIn(!!token);
        setHasCheckedAuth(true);
    }, []);

    if (!hasCheckedAuth) {
        return null;
    }
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }
    return (
        <div className="admin h-screen max-h-screen w-full flex-row-between-center" >

            <nav className="fixed top-0 left-0 z-50 
                            h-screen bg-admin-card-75 px-3 overflow-hidden
                            group w-12 hover:w-36 
                            transition-all duration-300">
                <div className="h-full flex-col-between-start gap-6 py-12">
                    <div className="flex flex-col gap-6 ">
                    {adminPagesItems.map((item) => (
                        <div key={item.path} className="">
                            <NavLink key={item.path} to={item.path} className="flex-row-start-center gap-2" >
                                <div className="min-w-6 min-h-6 bg-admin-primary-50 rounded-md"/>
                                <div className="btn-nav whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all delay-100 duration-300">
                                    {item.label}
                                </div>
                            </NavLink>
                        </div>
                    ))}
                    </div>
                    <button className="flex-row-start-center gap-2 p-0" onClick={() => setIsLoggedIn(false)}>
                        <div className="min-w-6 min-h-6 bg-admin-primary-50 rounded-md"/>
                        <div className="btn-nav whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all delay-100 duration-300">
                            登出
                        </div>
                    </button>
                </div>
            </nav>

            
            {/* 主要內容（md:pt-16 是避免被固定 header 遮住*/}
            <div className="flex-1 w-full min-h-0">
                <main className="mx-auto w-full" >
                    <Outlet />
                </main>
            </div>
            
            {/* 吐司彈窗（由 Redux state.dashboardToast 驅動，一律渲染） */}
            <div className="fixed bottom-0 right-0 z-50">
                <DashboardToast />
            </div>

            {/* 測試用 
            <div className="hidden fixed bottom-0 left-0 z-50 text-[8px] text-white p-2 bg-black/50 rounded-tr-md  flex flex-row-between-center gap-2">
                <p>測試用</p>
                <p>isLoggedIn：{isLoggedIn ? 'true' : 'false'}</p>
                <button className="px-2 py-0 bg-black/50 rounded-md text-2xs" onClick={() => setIsLoggedIn(!isLoggedIn)}>{isLoggedIn ? '登出' : '登入'}</button>
            </div>
            */}
        </div>
    )
}
