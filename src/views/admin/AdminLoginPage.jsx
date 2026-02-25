import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { notifyToast } from '../../api/cart';

const { VITE_API_URL } = import.meta.env;

// Email 格式驗證（React Hook Form pattern）
const EMAIL_PATTERN = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: 'Email 格式不正確',
};

export default function AdminLoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ====== 登入 ======
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onSubmit(data) {
    setLoading(true);
    setFailed(false);
    try {
      const res = await axios.post(`${VITE_API_URL}/admin/signin`, {
        username: data.username,
        password: data.password,
      });
      const { token, expired } = res.data;
      // 存 cookie
      document.cookie = `GlenToken=${token};expires=${new Date(expired)};`;
      // 設定 axios headers
      axios.defaults.headers.common['Authorization'] = token;
      // 通知MainLayout登入成功
      setIsLoggedIn(true);
      // 程式化導航：登入成功後跳轉到後台
      notifyToast('登入成功');
      navigate('/admin/ProductsManagement', { replace: true });

    } catch (error) {
      setFailed(true);
    }
    setLoading(false);
  }

  return (
    <main className="w-full h-screen flex-col-center">
      {/* 測試用 */}
            <div className="fixed bottom-0 left-0 z-50 text-[8px] text-white p-2 bg-black/50 rounded-tr-md  flex flex-row-between-center gap-2">
                <p>快速登入用</p>
                <p>isLoggedIn：{isLoggedIn ? 'true' : 'false'}</p>
                <button className="px-2 py-0 bg-black/50 rounded-md text-2xs" onClick={() => {setIsLoggedIn(!isLoggedIn); navigate('/admin/ProductsManagement', { replace: true });}}>{isLoggedIn ? '登出' : '登入'}</button>
            </div>

      <div className="w-full max-w-[320px] mx-auto rounded-md bg-card p-8">
        <h1 className="text-lg font-bold text-center mb-8">登入</h1>
        <form
          className="w-full flex-col-center gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="">
            <label htmlFor="username" className="mr-2">信箱</label>
            <input
              id="username"
              type="email"
              placeholder="請輸入 Email"
              {...register('username', {
                required: '請輸入 Email。',
                pattern: EMAIL_PATTERN,
              })}
            />
            {errors.username && (
              <p className="text-sm text-error">{errors.username.message}</p>
            )}
          </div>

          <div className="">
            <label htmlFor="password" className="mr-2">密碼</label>
            <input
              id="password"
              type="password"
              placeholder="請輸入密碼"
              {...register('password', {
                required: '請輸入密碼。',
              })}
            />
            {errors.password && (
              <p className="text-sm text-error">{errors.password.message}</p>
            )}
          </div>
          <div className="flex-col--center gap-2">

          <p className="text-sm text-error">
            {failed ? '登入失敗，請檢查帳號密碼' : '\u00A0'}
          </p>
          <button
            type="submit"
            id="login"
            className={`btn-primary ${loading ? 'disabled' : ''}`}
          >
            {loading ? '登入中...' : '登入'}
          </button>
          </div>
        </form>
      </div>
    </main>
  );
}
