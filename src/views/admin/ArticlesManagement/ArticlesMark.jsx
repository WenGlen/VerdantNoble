import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { useDispatch } from 'react-redux';
const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

import { createAsyncDashboardToast } from '../../../slices/DashboardToastSlice';

const FEATURED_TAG = '精選';

export default function ArticlesMark() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [togglingId, setTogglingId] = useState(null);
    const dispatch = useDispatch();

    const loadArticles = useCallback(async () => {
        setLoading(true);
        try {
            let all = [];
            let page = 1;
            let hasMore = true;
            while (hasMore) {
                const res = await axios.get(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/articles?page=${page}`);
                if (res.data.success) {
                    all = [...all, ...(res.data.articles || [])];
                    hasMore = res.data.pagination?.has_next || false;
                    page++;
                } else {
                    hasMore = false;
                }
            }
            setArticles(all);
        } catch {
            dispatch(createAsyncDashboardToast({ message: "取得文章列表失敗", success: false }));
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    useEffect(() => {
        loadArticles();
    }, [loadArticles]);

    const featuredArticle = articles.find(a => Array.isArray(a.tag) && a.tag.includes(FEATURED_TAG));

    function formatTimestamp(ts) {
        if (!ts) return '';
        return new Date(ts * 1000).toLocaleDateString('zh-TW', {
            year: 'numeric', month: '2-digit', day: '2-digit',
        });
    }

    // 取得文章的完整資料並修改標籤後 PUT
    async function setFeatured(article) {
        if (article.id === featuredArticle?.id) return; // 已是精選，不重複觸發

        setTogglingId(article.id);
        try {
            // 步驟 1：取得要設為精選的文章完整資料
            const newRes = await axios.get(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/article/${article.id}`);
            const newArticle = newRes.data.article;
            const newTags = Array.isArray(newArticle.tag)
                ? [...new Set([...newArticle.tag, FEATURED_TAG])]
                : [FEATURED_TAG];

            // 步驟 2：如果有舊的精選文章，先把它的「精選」tag 移除
            if (featuredArticle && featuredArticle.id !== article.id) {
                const oldRes = await axios.get(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/article/${featuredArticle.id}`);
                const oldArticle = oldRes.data.article;
                const oldTags = (oldArticle.tag || []).filter(t => t !== FEATURED_TAG);
                await axios.put(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/article/${featuredArticle.id}`, {
                    data: { ...oldArticle, tag: oldTags },
                });
            }

            // 步驟 3：設新的文章為精選
            await axios.put(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/article/${article.id}`, {
                data: { ...newArticle, tag: newTags },
            });

            // 更新本地列表的 tag（不重新 fetch）
            setArticles(prev => prev.map(a => {
                if (a.id === article.id) return { ...a, tag: newTags };
                if (a.id === featuredArticle?.id) return { ...a, tag: (a.tag || []).filter(t => t !== FEATURED_TAG) };
                return a;
            }));

            dispatch(createAsyncDashboardToast({
                message: `「${article.title}」已設為精選文章`,
                success: true,
            }));
        } catch {
            dispatch(createAsyncDashboardToast({ message: "更新失敗，請稍後再試", success: false }));
        } finally {
            setTogglingId(null);
        }
    }

    async function clearFeatured() {
        if (!featuredArticle) return;
        setTogglingId(featuredArticle.id);
        try {
            const res = await axios.get(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/article/${featuredArticle.id}`);
            const full = res.data.article;
            const newTags = (full.tag || []).filter(t => t !== FEATURED_TAG);
            await axios.put(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/article/${featuredArticle.id}`, {
                data: { ...full, tag: newTags },
            });
            setArticles(prev => prev.map(a =>
                a.id === featuredArticle.id ? { ...a, tag: newTags } : a
            ));
            dispatch(createAsyncDashboardToast({ message: "已取消精選文章", success: true }));
        } catch {
            dispatch(createAsyncDashboardToast({ message: "更新失敗，請稍後再試", success: false }));
        } finally {
            setTogglingId(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-80 h-[300px] p-3 flex flex-col gap-6 justify-center items-center rounded-lg bg-admin-card-50 shadow-md">
                    <Oval height={80} width={80} color="var(--color-admin-text-hover)" secondaryColor="var(--color-admin-bg)" strokeWidth={6} />
                    <p className="text-sm text-center">資料讀取中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-3xl mx-auto">

            {/* 標題列 */}
            <div className="flex items-end justify-between mb-6">
                <div>
                    <h2 className="text-admin-text">精選文章管理</h2>
                    <p className="text-sm text-admin-text-muted mt-1">
                        精選文章將顯示於文章頁頂部橫幅，僅能設定 1 篇
                    </p>
                </div>
                <button
                    type="button"
                    className="admin-btn-muted"
                    onClick={loadArticles}
                >
                    重新整理
                </button>
            </div>

            {/* 目前精選 */}
            <h3>目前精選文章</h3>
            <div className="mb-6 p-4 rounded bg-admin-card-edit">

                {featuredArticle ? (
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            {featuredArticle.image && (
                                <div className="w-14 h-14 shrink-0 rounded overflow-hidden bg-admin-card-50">
                                    <img src={featuredArticle.image} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="font-semibold text-sm text-admin-text truncate">{featuredArticle.title}</p>
                                <p className="text-xs text-admin-text-muted">
                                    {featuredArticle.author} {formatTimestamp(featuredArticle.create_at)}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="admin-btn-warning shrink-0"
                            disabled={togglingId === featuredArticle.id}
                            onClick={clearFeatured}
                        >
                            {togglingId === featuredArticle.id ? "更新中..." : "取消精選"}
                        </button>
                    </div>
                ) : (
                    <p className="text-sm text-admin-text-muted italic">尚未設定精選文章</p>
                )}
            </div>

            {/* 文章列表 */}
            <div className="w-full flex-row-start-center gap-2">
            <h3>所有文章</h3>  <p className="text-sm text-admin-text-muted">（點擊「設為精選」更換精選文章）</p>
            </div>
            <div className="flex flex-col gap-2">
                {articles.map(article => {
                    const isFeatured = Array.isArray(article.tag) && article.tag.includes(FEATURED_TAG);
                    const isToggling = togglingId === article.id;

                    return (
                        <div
                            key={article.id}
                            className={`flex items-center gap-4 p-3 rounded transition-all duration-150
                                ${isFeatured
                                    ? "bg-admin-card-edit"
                                    : "bg-admin-card-50"
                                }
                            `}
                        >
                            {/* 封面縮圖 */}
                            {article.image && (
                                <div className="w-12 h-12 shrink-0 rounded overflow-hidden bg-admin-card-50">
                                    <img src={article.image} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* 文章資訊 */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-sm text-admin-text truncate">{article.title}</p>
                                    {!article.isPublic && (
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-admin-card-50 text-admin-text-muted shrink-0">未公開</span>
                                    )}
                                </div>
                                <p className="text-xs text-admin-text-muted">
                                    {article.author} {formatTimestamp(article.create_at)}
                                </p>
                            </div>

                            {/* 精選狀態 + 按鈕 */}
                            {isFeatured ? (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-admin-primary text-white shrink-0">
                                    精選中
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    className="admin-btn-muted shrink-0"
                                    disabled={isToggling || togglingId !== null}
                                    onClick={() => setFeatured(article)}
                                >
                                    {isToggling ? "更新中..." : "設為精選"}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
