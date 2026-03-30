import { Outlet, Navigate, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import DashboardToast from "../../components/admin/elements/DashboardToast";

import LogoutIcon from "../../img/Logout.png";

export default function AdminLayout({ adminPagesItems = [] }) {
  // 所有 Hook 必須在條件式 return 之前呼叫
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("GlenToken="))
      ?.split("=")[1];
    queueMicrotask(() => {
      if (token) {
        axios.defaults.headers.common["Authorization"] = token;
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setHasCheckedAuth(true);
    });
  }, []);

  function handleLogout() {
    document.cookie =
      "GlenToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    delete axios.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
  }

  if (!hasCheckedAuth) {
    return null;
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="admin h-screen max-h-screen w-full flex-row-between-center">
      <nav
        className="fixed top-0 left-0 z-50 
                            h-screen bg-admin-card-75 px-3 overflow-hidden
                            group w-12 hover:w-32 
                            transition-all duration-300"
      >
        <div className="h-full flex-col-between-start gap-6 py-16">
          <div className="flex flex-col gap-6 p-4 ">
            {adminPagesItems.map((item) => (
              <div key={item.path} className="">
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex-row-center-center gap-2 no-underline"
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={`w-6 h-6 ${item.path === location.pathname ? " opacity-100" : "opacity-50"}`}
                  />
                  <div
                    className={`admin-btn-nav whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all delay-100 duration-300 ${item.path === location.pathname ? " active" : ""}`}
                  >
                    {item.label}
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
          <button
            className="flex-row-start-center gap-2 p-0"
            onClick={handleLogout}
          >
            <img src={LogoutIcon} alt="登出" className="w-6 h-6 opacity-50" />
            <div className="btn-nav whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all delay-100 duration-300">
              登出
            </div>
          </button>
        </div>
      </nav>

      {/* 主要內容（md:pt-16 是避免被固定 header 遮住*/}
      <div className="flex-1 w-full min-h-0">
        <main className="mx-auto w-full">
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
  );
}
