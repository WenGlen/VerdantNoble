import { useState, useEffect } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
const { VITE_API_URL, VITE_API_PATH } = import.meta.env;

import { createAsyncDashboardToast } from '../../../slices/DashboardToastSlice';
import { fetchProducts } from '../../../slices/productsSlice';
import ModButton from '../../../components/admin/elements/ModButton';
import ArticlesFocusPanel from '../../../components/admin/panels/article/ArticlesFocusPanel';
import ArticlesEditPanel from '../../../components/admin/panels/article/ArticlesEditPanel';
import ArticlesList from '../../../components/admin/panels/article/ArticlesList';

const DEFAULT_ARTICLE = {
    title: "",
    description: "",
    image: "",
    tag: [],
    author: "",
    isPublic: false,
    create_at: null,
    content: [],
    relatedProducts: [],
};

export default function ArticlesManagement() {
    const [mod, setMod] = useState("view");
    const [articles, setArticles] = useState([]);
    const [firstTimeLoading, setFirstTimeLoading] = useState(true);
    const [focus, setFocus] = useState({});
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.list);

    // ====== 一進入頁面就取得文章列表與商品列表 ======
    useEffect(() => {
        getArticles();
        dispatch(fetchProducts());
    }, []);

    // ====== 取得所有文章（逐頁累積） ======
    async function getArticles() {
        setMod("get");
        setFocus({});
        try {
            let allArticles = [];
            let page = 1;
            let hasMore = true;
            while (hasMore) {
                const res = await axios.get(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/articles?page=${page}`);
                if (res.data.success) {
                    allArticles = [...allArticles, ...(res.data.articles || [])];
                    hasMore = res.data.pagination?.has_next || false;
                    page++;
                } else {
                    hasMore = false;
                }
            }
            setArticles(allArticles);
            setFirstTimeLoading(false);
            dispatch(createAsyncDashboardToast({ message: "成功取得文章列表", success: true }));
        } catch (error) {
            setArticles([]);
            dispatch(createAsyncDashboardToast(error.response?.data || { message: "取得文章列表失敗", success: false }));
        }
        setMod("view");
        resetEditingArticle();
    }

    // ====== 重置編輯狀態 ======
    const [editingArticle, setEditingArticle] = useState({ ...DEFAULT_ARTICLE, tag: [], content: [] });
    const [inputError, setInputError] = useState("");

    function resetEditingArticle() {
        setEditingArticle({ ...DEFAULT_ARTICLE, tag: [], content: [], relatedProducts: [] });
        setInputError("");
    }

    useEffect(() => {
        if (mod === "add") resetEditingArticle();
    }, [mod]);

    // ====== 查看文章（取得完整 content 顯示於 FocusPanel） ======
    async function viewArticle(item) {
        setFocus(item); // 先顯示已有的基本資訊
        try {
            const res = await axios.get(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/article/${item.id}`);
            setFocus(res.data.article);
        } catch {
            // 失敗時保留原本的基本資訊，內文顯示空即可
        }
    }

    // ====== 編輯文章（需另外取得完整 content） ======
    const [fetchingArticle, setFetchingArticle] = useState(false);

    async function editArticle(item) {
        setFetchingArticle(true);
        setMod("update");
        try {
            const res = await axios.get(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/article/${item.id}`);
            const article = res.data.article;
            let blocks = [];
            try {
                const parsed = JSON.parse(article.content);
                blocks = Array.isArray(parsed) ? parsed : [];
            } catch {
                blocks = [];
            }
            setFocus({ ...article });
            setEditingArticle({
                title: article.title || "",
                description: article.description || "",
                image: article.image || "",
                tag: Array.isArray(article.tag) ? [...article.tag] : [],
                author: article.author || "",
                isPublic: article.isPublic || false,
                create_at: article.create_at || null,
                content: blocks,
                relatedProducts: Array.isArray(article.relatedProducts) ? [...article.relatedProducts] : [],
            });
        } catch (error) {
            dispatch(createAsyncDashboardToast({ message: "取得文章內容失敗", success: false }));
            setMod("view");
        } finally {
            setFetchingArticle(false);
            setInputError("");
        }
    }

    // ====== 刪除 ======
    const [deleteTargetId, setDeleteTargetId] = useState("");
    const [deleting, setDeleting] = useState(false);

    function DeleteMod(id) {
        setMod("delete");
        setDeleteTargetId(id);
    }

    async function deleteArticle(id) {
        setDeleting(true);
        try {
            await axios.delete(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/article/${id}`);
            getArticles();
            setFocus({});
            setMod("view");
            setDeleteTargetId("");
            dispatch(createAsyncDashboardToast({ message: "成功刪除文章", success: true }));
        } catch (error) {
            setMod("view");
            dispatch(createAsyncDashboardToast(error.response?.data || { message: "刪除文章失敗", success: false }));
        } finally {
            setDeleting(false);
        }
    }

    function handleCancelDelete() {
        setMod("view");
        setDeleteTargetId("");
    }

    // ====== 新增/更新文章 ======
    const [uploading, setUploading] = useState(false);

    function checkInputError() {
        if (!editingArticle.title.trim()) return "標題不得為空";
        if (!editingArticle.description.trim()) return "摘要不得為空";
        if (!editingArticle.author.trim()) return "作者不得為空";
        return "";
    }

    async function uploadArticle(currentMod) {
        if (currentMod !== "add" && currentMod !== "update") return;
        setUploading(true);
        setInputError("");
        const error = checkInputError();
        if (error) {
            setUploading(false);
            setInputError(error);
            return;
        }
        const uploadItem = {
            data: {
                title: editingArticle.title,
                description: editingArticle.description,
                image: editingArticle.image,
                tag: editingArticle.tag,
                author: editingArticle.author,
                isPublic: editingArticle.isPublic,
                create_at: editingArticle.create_at || Math.floor(Date.now() / 1000),
                content: JSON.stringify(editingArticle.content),
                relatedProducts: editingArticle.relatedProducts || [],
            },
        };
        try {
            if (currentMod === "add") {
                await axios.post(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/article`, uploadItem);
                dispatch(createAsyncDashboardToast({ message: "新增文章成功", success: true }));
            } else {
                await axios.put(`${VITE_API_URL}/api/${VITE_API_PATH}/admin/article/${focus.id}`, uploadItem);
                dispatch(createAsyncDashboardToast({ message: "更新文章成功", success: true }));
            }
            getArticles();
        } catch (error) {
            dispatch(createAsyncDashboardToast(error.response?.data || { message: "上傳文章失敗", success: false }));
        } finally {
            setUploading(false);
        }
    }

    // ====== Block 更新 ======
    function handleBlocksChange(blocks) {
        setEditingArticle(prev => ({ ...prev, content: blocks }));
    }

    function eventHandlerEditingArticle(e) {
        const { name, value } = e.target;
        setEditingArticle(prev => ({ ...prev, [name]: value }));
    }

    // ====== RWD 偵測 ======
    const [WindowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        function handleResize() { setWindowWidth(window.innerWidth); }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                <div className="relative flex-row-between-center gap-6 pl-12 h-screen">
                    <div />

                    {/* 文章列表 */}
                    <div className="h-[90vh] max-h-[90vh] w-fit min-w-[720px] p-6 rounded-lg bg-admin-card shadow-md flex flex-col gap-6">
                        <ArticlesList
                            articles={articles}
                            mod={mod}
                            viewArticle={viewArticle}
                            deleteTargetId={deleteTargetId}
                            onDeleteMod={DeleteMod}
                            onCancelDelete={handleCancelDelete}
                            onConfirmDelete={deleteArticle}
                            deleting={deleting}
                            editArticle={editArticle}
                        />
                        <div className="flex justify-between">
                            <ModButton
                                type="get"
                                mod={mod}
                                action={() => getArticles()}
                                label="重新取得文章列表"
                                loadingLabel="文章列表更新中..."
                            />
                            <ModButton
                                type="add"
                                mod={mod}
                                action={() => setMod("add")}
                                label="新增文章"
                                loadingLabel="新增文章中..."
                            />
                        </div>
                    </div>

                    {/* 右側面板 */}
                    <div className={`RWD-overlay ${(mod === "view" && !focus.id && WindowWidth < 1280) ? "hidden" : ""}`}>
                        <div className="RWD-container">
                            <div className="RWD-content">
                                {mod !== "add" && mod !== "update" ? (
                                    <ArticlesFocusPanel
                                        focus={focus}
                                        setFocus={setFocus}
                                        editArticle={editArticle}
                                        viewArticle={viewArticle}
                                        setMod={setMod}
                                    />
                                ) : (
                                    <ArticlesEditPanel
                                        editingArticle={editingArticle}
                                        setEditingArticle={setEditingArticle}
                                        eventHandlerEditingArticle={eventHandlerEditingArticle}
                                        onBlocksChange={handleBlocksChange}
                                        mod={mod}
                                        setMod={setMod}
                                        setFocus={setFocus}
                                        uploading={uploading}
                                        fetchingArticle={fetchingArticle}
                                        resetEditingArticle={resetEditingArticle}
                                        inputError={inputError}
                                        uploadArticle={uploadArticle}
                                        url={VITE_API_URL}
                                        path={VITE_API_PATH}
                                        products={products}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="tablet:block hidden" />
                </div>
            )}
        </>
    );
}
