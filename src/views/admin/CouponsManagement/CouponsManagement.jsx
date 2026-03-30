import { useState, useEffect, useCallback } from "react";
import { Oval } from "react-loader-spinner";
import { useDispatch } from "react-redux";

import { createAsyncDashboardToast } from "../../../slices/DashboardToastSlice";
import ModButton from "../../../components/admin/elements/ModButton";
import CouponsList from "../../../components/admin/panels/coupon/CouponsList";
import CouponEditPanel from "../../../components/admin/panels/coupon/CouponEditPanel";
import {
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
} from "../../../api/coupons";
import {
  COUPON_DISCOUNT_FIXED,
  COUPON_DISCOUNT_PERCENT,
  buildAdminCouponPayload,
  normalizeCouponFromApi,
} from "../../../utils/couponNormalize";

function normalizeCouponList(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") return Object.values(raw);
  return [];
}

function tsToDatetimeLocal(ts) {
  const n = Number(ts);
  if (!Number.isFinite(n)) return "";
  const d = new Date(n * 1000);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function datetimeLocalToUnix(value) {
  if (!value) return 0;
  const ms = new Date(value).getTime();
  if (Number.isNaN(ms)) return 0;
  return Math.floor(ms / 1000);
}

const emptyForm = {
  code: "",
  title: "",
  discount_type: COUPON_DISCOUNT_PERCENT,
  percent: 80,
  fixed_amount: "",
  is_enabled: 1,
  due_date_local: "",
};

export default function CouponsManagement() {
  const dispatch = useDispatch();
  const [coupons, setCoupons] = useState([]);
  const [mod, setMod] = useState("view");
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTargetId, setDeleteTargetId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetForm = useCallback(() => {
    setForm(emptyForm);
    setEditingId(null);
    setMod("view");
  }, []);

  const fetchAllCoupons = useCallback(async () => {
    setMod("get");
    try {
      let all = [];
      let page = 1;
      let hasMore = true;
      const MAX_PAGES = 50;
      while (hasMore && page <= MAX_PAGES) {
        const res = await getAdminCoupons(page);
        if (res.data?.success === false) {
          throw new Error(res.data?.message || "取得列表失敗");
        }
        const chunk = normalizeCouponList(res.data?.coupons).map(
          normalizeCouponFromApi,
        );
        all = [...all, ...chunk];
        const pag = res.data?.pagination;
        if (!pag) {
          break;
        }
        hasMore = pag.has_next === true;
        page += 1;
      }
      setCoupons(all);
      setFirstTimeLoading(false);
      dispatch(
        createAsyncDashboardToast({
          message: "成功取得優惠券列表",
          success: true,
        }),
      );
    } catch (error) {
      setCoupons([]);
      dispatch(
        createAsyncDashboardToast(
          error.response?.data || {
            message: error.message || "取得優惠券列表失敗",
            success: false,
          },
        ),
      );
    }
    setMod("view");
    setDeleteTargetId("");
  }, [dispatch]);

  useEffect(() => {
    fetchAllCoupons();
  }, [fetchAllCoupons]);

  function startAdd() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      due_date_local: tsToDatetimeLocal(
        Math.floor(Date.now() / 1000) + 86400 * 30,
      ),
    });
    setMod("add");
  }

  function startEdit(c) {
    const id = c.id;
    if (!id) {
      dispatch(
        createAsyncDashboardToast({
          message: "此筆資料缺少 id，無法編輯",
          success: false,
        }),
      );
      return;
    }
    setEditingId(id);
    const n = normalizeCouponFromApi(c);
    setForm({
      code: n.code ?? "",
      title: n.title ?? "",
      discount_type: n.discount_type ?? COUPON_DISCOUNT_PERCENT,
      percent:
        n.discount_type === COUPON_DISCOUNT_FIXED
          ? 100
          : Number(n.percent) || 80,
      fixed_amount:
        n.discount_type === COUPON_DISCOUNT_FIXED
          ? String(n.fixed_amount ?? "")
          : "",
      is_enabled: n.is_enabled ? 1 : 0,
      due_date_local: tsToDatetimeLocal(n.due_date),
    });
    setMod("update");
  }

  function DeleteMod(id) {
    if (!id) {
      dispatch(
        createAsyncDashboardToast({
          message: "缺少 id，無法刪除",
          success: false,
        }),
      );
      return;
    }
    setMod("delete");
    setDeleteTargetId(id);
  }

  function handleCancelDelete() {
    setMod("view");
    setDeleteTargetId("");
  }

  async function deleteCoupon(id) {
    setDeleting(true);
    try {
      const res = await deleteAdminCoupon(id);
      if (res.data?.success === false) {
        throw new Error(res.data?.message || "刪除失敗");
      }
      dispatch(
        createAsyncDashboardToast({
          message: res.data?.message || "已刪除優惠券",
          success: true,
        }),
      );
      await fetchAllCoupons();
      setMod("view");
      setDeleteTargetId("");
    } catch (error) {
      setMod("view");
      setDeleteTargetId("");
      dispatch(
        createAsyncDashboardToast(
          error.response?.data || {
            message: error.message || "刪除失敗",
            success: false,
          },
        ),
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const due = datetimeLocalToUnix(form.due_date_local);

    let payload;
    try {
      payload = buildAdminCouponPayload(form, due);
    } catch (err) {
      dispatch(
        createAsyncDashboardToast({
          message: err?.message || "表單驗證失敗",
          success: false,
        }),
      );
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const res = await updateAdminCoupon(editingId, payload);
        if (res.data?.success === false) {
          throw new Error(res.data?.message || "更新失敗");
        }
        dispatch(
          createAsyncDashboardToast({
            message: res.data?.message || "已更新優惠券",
            success: true,
          }),
        );
      } else {
        const res = await createAdminCoupon(payload);
        if (res.data?.success === false) {
          throw new Error(res.data?.message || "新增失敗");
        }
        dispatch(
          createAsyncDashboardToast({
            message: res.data?.message || "已建立優惠券",
            success: true,
          }),
        );
      }
      resetForm();
      await fetchAllCoupons();
    } catch (error) {
      dispatch(
        createAsyncDashboardToast(
          error.response?.data || {
            message: error.message || "操作失敗",
            success: false,
          },
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {firstTimeLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-80 h-[300px] p-3 flex flex-col gap-6 justify-center items-center rounded-lg bg-admin-card-50 shadow-md">
            <Oval
              height={80}
              width={80}
              color="var(--color-admin-text-hover)"
              secondaryColor="var(--color-admin-bg)"
              strokeWidth={6}
            />
            <p className="text-sm text-center">資料讀取中...</p>
          </div>
        </div>
      ) : (
        <div className="relative flex-row-between-center gap-6 pl-12 h-screen">
          <div />
          <div className="h-[90vh] max-h-[90vh] w-fit min-w-[720px] p-6 rounded-lg bg-admin-card shadow-md flex flex-col gap-6">
            <CouponsList
              coupons={coupons}
              mod={mod}
              onEdit={startEdit}
              deleteTargetId={deleteTargetId}
              onDeleteMod={DeleteMod}
              onCancelDelete={handleCancelDelete}
              onConfirmDelete={deleteCoupon}
              deleting={deleting}
            />
            <div className="flex justify-between">
              <ModButton
                type="get"
                mod={mod}
                action={fetchAllCoupons}
                label="重新取得優惠券列表"
              />
              <ModButton
                type="add"
                mod={mod}
                action={startAdd}
                label="新增優惠券"
              />
            </div>
          </div>

          <div className="tablet:block hidden" />

          <div
            className={`RWD-overlay ${mod === "view" && windowWidth < 1280 ? "hidden" : ""}`}
          >
            <div className="RWD-container">
              <div className="RWD-content RWD-content--coupon">
                {mod === "add" || mod === "update" ? (
                  <CouponEditPanel
                    form={form}
                    setForm={setForm}
                    mod={mod}
                    editingId={editingId}
                    saving={saving}
                    onCancel={resetForm}
                    onSubmit={handleSubmit}
                  />
                ) : (
                  <div className="h-full flex justify-center items-center">
                    <div className="h-fit xl:h-screen w-[400px] flex-col-center gap-2 overflow-x-auto p-4 bg-admin-card-focus tablet:rounded-md">
                      <p className="text-center text-sm text-slate-600 m-0 leading-relaxed">
                        點擊「新增優惠券」建立新折扣碼
                        <br />
                        或於列表按「修改」圖示編輯既有優惠券
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
