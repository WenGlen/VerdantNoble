import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { notifyToast } from '../../api/cart';
import { persistGlenToken, setAxiosAuthorization } from '../../utils/adminAuthSideEffects';

const { VITE_API_URL } = import.meta.env;

// Email 格式驗證（React Hook Form pattern）
const EMAIL_PATTERN = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: 'Email 格式不正確',
};

export default function AdminLoginPage() {
  const navigate = useNavigate();

  // ====== 進入登入頁時先檢查是否已登入 ======
  const checkLogin = useCallback(async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('GlenToken='))
        ?.split('=')[1];
      if (!token) return;
      setAxiosAuthorization(token);
      await axios.post(`${VITE_API_URL}/api/user/check`);
      navigate('/admin/ProductsManagement', { replace: true });
    } catch {
      // token 無效，留在登入頁
    }
  }, [navigate]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

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
      persistGlenToken(token, expired);
      setAxiosAuthorization(token);
      // 程式化導航：登入成功後跳轉到後台
      notifyToast('登入成功');
      navigate('/admin/ProductsManagement', { replace: true });

    } catch {
      setFailed(true);
    }
    setLoading(false);
  }

  return (
    <main className="w-full h-screen flex-col-center">
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
