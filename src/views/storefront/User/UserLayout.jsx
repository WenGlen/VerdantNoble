import { Outlet, NavLink, useLocation } from "react-router-dom";

export default function UserLayout() {
  const location = useLocation();

  const isOrders =
    location.pathname.includes("/user/orders") || location.pathname === "/user";
  const isInfo = location.pathname.includes("/user/info");
  /*
  // 原本以為顧客也要做登入，但後來發現不需要，所以註解掉
  // 未登入則導回登入頁，並記住原本要去的路徑（登入後可導回）
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const isLoggedIn = outletContext?.isLoggedIn ?? false;
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  // 未登入時不渲染（useEffect 會導向登入頁）
  if (!isLoggedIn) {
    return null;
  }
  */
  return (
    <div className="w-full max-w-screen-md mx-auto flex flex-col md:flex-row gap-12">
      <nav className="w-full md:w-[150px] md:min-w-[150px] h-fit sticky md:top-24 bg-panel-50 rounded-br-lg md:rounded-md p-6 flex flex-row md:flex-col gap-4">
        <NavLink
          to="/user/orders"
          className={({ isActive }) =>
            `btn-link ${isActive || isOrders ? "active" : ""}`
          }
        >
          查看訂單
        </NavLink>
        <NavLink
          to="/user/info"
          className={({ isActive }) =>
            `btn-link ${isActive || isInfo ? "active" : ""}`
          }
        >
          會員資料
        </NavLink>
      </nav>

      <div className="w-full mx-auto ">
        <Outlet />
      </div>
    </div>
  );
}
