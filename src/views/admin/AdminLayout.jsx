import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

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

            <nav className="h-screen bg-admin-card-50 p-4" >
                {adminPagesItems.map((item) => (
                    <NavLink key={item.path} to={item.path} className="btn-nav" >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            
            {/* 主要內容（md:pt-16 是避免被固定 header 遮住*/}
            <div className="flex-1 w-full min-h-0">
                <main className="mx-auto w-full" >
                    <Outlet />
                </main>
            </div>


            <div className="fixed bottom-0 left-0 z-50 text-[8px] text-white p-2 bg-black/50 rounded-tr-md  flex flex-row-between-center gap-2">
                <p>測試用</p>
                <p>isLoggedIn：{isLoggedIn ? 'true' : 'false'}</p>
                <button className="px-2 py-0 bg-black/50 rounded-md text-2xs" onClick={() => setIsLoggedIn(!isLoggedIn)}>{isLoggedIn ? '登出' : '登入'}</button>
            </div>
        </div>
    )
}
