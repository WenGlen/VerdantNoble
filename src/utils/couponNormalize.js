/**
 * 課程 API 文件：admin coupon 使用 percent（1–100）表示「結帳小計 × percent%」之應付金額比例。
 * 另可附帶 discount_type、fixed_amount；若後端會儲存即可支援定額折抵，否則仍以 POST /coupon 回傳之 final_total 為準。
 */

export const COUPON_DISCOUNT_PERCENT = "percent";
export const COUPON_DISCOUNT_FIXED = "fixed";

/**
 * 將列表／詳情 API 回傳的一筆優惠券正規化（補上 discount_type、fixed_amount）
 * @param {object} c
 */
export function normalizeCouponFromApi(c) {
  if (!c || typeof c !== "object") return c;
  const fixedRaw = c.fixed_amount ?? c.amount ?? c.discount_amount;
  const fixed = fixedRaw != null ? Number(fixedRaw) : NaN;
  const typeFromApi = c.discount_type;

  if (
    typeFromApi === COUPON_DISCOUNT_FIXED ||
    (Number.isFinite(fixed) && fixed > 0)
  ) {
    return {
      ...c,
      discount_type: COUPON_DISCOUNT_FIXED,
      fixed_amount: Number.isFinite(fixed) && fixed > 0 ? Math.round(fixed) : 0,
    };
  }

  return {
    ...c,
    discount_type: COUPON_DISCOUNT_PERCENT,
    fixed_amount: 0,
    percent: c.percent != null ? Number(c.percent) : 100,
  };
}

/**
 * 建構 POST/PUT admin/coupon 的 data 本體
 * @param {object} form — code, title, is_enabled, discount_type, percent, fixed_amount
 * @param {number} dueUnix — due_date unix 秒
 */
export function buildAdminCouponPayload(form, dueUnix) {
  const code = String(form.code ?? "").trim();
  const title = String(form.title ?? "").trim();
  const is_enabled = form.is_enabled ? 1 : 0;

  if (!code || !title) {
    throw new Error("折扣碼與標題為必填");
  }
  if (!dueUnix) {
    throw new Error("請選擇有效到期時間");
  }

  const base = {
    code,
    title,
    is_enabled,
    due_date: dueUnix,
  };

  if (form.discount_type === COUPON_DISCOUNT_FIXED) {
    const amt = Math.round(Number(form.fixed_amount));
    if (!Number.isFinite(amt) || amt < 1) {
      throw new Error("定額折抵須為至少 1 元的正整數");
    }
    return {
      ...base,
      discount_type: COUPON_DISCOUNT_FIXED,
      fixed_amount: amt,
      /** 課程欄位：定額時給 100 表示不另外套用「比例折」；實際折抵靠後端是否解讀 fixed_amount */
      percent: 100,
    };
  }

  const pct = Math.round(Number(form.percent));
  if (!Number.isFinite(pct) || pct < 1 || pct > 100) {
    throw new Error("支付比例須為 1–100（與課程 API：小計可乘上之百分比）");
  }

  return {
    ...base,
    discount_type: COUPON_DISCOUNT_PERCENT,
    percent: pct,
    fixed_amount: 0,
  };
}

/** 後台列表「折扣」欄顯示 */
export function formatCouponRuleLabel(c) {
  const n = normalizeCouponFromApi(c);
  if (n.discount_type === COUPON_DISCOUNT_FIXED && Number(n.fixed_amount) > 0) {
    return `定額 ${Number(n.fixed_amount).toLocaleString("zh-TW")} 元`;
  }
  if (n.percent != null && n.percent !== "") {
    return `小計× ${n.percent} %`;
  }
  return "—";
}

/**
 * 從 POST /coupon 的 data 解析優惠類型（後端可選附帶 discount_type、percent、fixed_amount，或包在 coupon 物件內）
 * @param {object} data — res.data.data
 * @returns {object | null} 正規化後之優惠物件，見 normalizeCouponFromApi
 */
export function pickCouponMetaFromApplyResponse(data) {
  if (!data || typeof data !== "object") return null;
  const nested = data.coupon;
  const discount_type = normalizeDiscountTypeString(
    (nested && nested.discount_type) ?? data.discount_type,
  );
  const percent =
    (nested && nested.percent != null ? nested.percent : undefined) ??
    data.percent;
  const fixedRaw =
    (nested &&
      (nested.fixed_amount ?? nested.amount ?? nested.discount_amount)) ??
    data.fixed_amount ??
    data.amount ??
    data.discount_amount;
  const hasType = discount_type != null && discount_type !== "";
  const hasPercent = percent != null && percent !== "";
  const fixedNum = fixedRaw != null && fixedRaw !== "" ? Number(fixedRaw) : NaN;
  const hasFixed = Number.isFinite(fixedNum) && fixedNum > 0;

  if (!hasType && !hasPercent && !hasFixed) return null;

  return normalizeCouponFromApi({
    discount_type,
    percent,
    fixed_amount: fixedRaw,
    amount: fixedRaw,
  });
}

/** 後端可能回 fixed_amount / percent 字串或不同大小寫之 discount_type */
function normalizeDiscountTypeString(raw) {
  if (raw == null || raw === "") return undefined;
  const s = String(raw).trim().toLowerCase();
  if (s === COUPON_DISCOUNT_FIXED || s === "fixed_amount") {
    return COUPON_DISCOUNT_FIXED;
  }
  if (s === COUPON_DISCOUNT_PERCENT || s === "percent" || s === "percentage") {
    return COUPON_DISCOUNT_PERCENT;
  }
  return raw;
}

/**
 * 課程 API：GET /cart 本文為 { success, data: { carts, total, final_total } }
 * @param {{ data?: object } | null | undefined} cartAxiosRes — axios 回傳整包，或已等同 res.data 之身分本文
 * @returns {object | null}
 */
export function unwrapCartApiInner(cartAxiosRes) {
  const body = cartAxiosRes?.data;
  if (!body || typeof body !== "object") return null;

  const inner = body.data;
  if (
    inner &&
    typeof inner === "object" &&
    !Array.isArray(inner) &&
    (Array.isArray(inner.carts) ||
      inner.total != null ||
      inner.final_total != null ||
      inner.finalTotal != null)
  ) {
    return aggregateCartTotals(inner);
  }

  if (
    Array.isArray(body.carts) ||
    body.total != null ||
    body.final_total != null ||
    body.finalTotal != null
  ) {
    return aggregateCartTotals(body);
  }

  return null;
}

function aggregateCartTotals(inner) {
  const carts = Array.isArray(inner.carts) ? inner.carts : [];
  let total = pickNum(inner.total ?? inner.Total);
  let final_total = pickNum(inner.final_total ?? inner.finalTotal);

  if (!Number.isFinite(total) && carts.length > 0) {
    total = carts.reduce((s, c) => s + pickNum(c.total ?? c.subtotal ?? 0), 0);
  }
  if (!Number.isFinite(final_total) && carts.length > 0) {
    const lineFinals = carts.map((c) => pickNum(c.final_total ?? c.finalTotal));
    if (lineFinals.every((n) => Number.isFinite(n))) {
      final_total = lineFinals.reduce((a, b) => a + b, 0);
    }
  }

  return {
    ...inner,
    carts,
    total,
    final_total,
  };
}

function pickNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function pickFinalTotalFromPayload(obj) {
  if (!obj || typeof obj !== "object") return NaN;
  const n = pickNum(obj.final_total ?? obj.finalTotal ?? obj.data?.final_total);
  return n;
}

function pickPostCouponData(postResBody) {
  if (!postResBody || typeof postResBody !== "object") return null;
  const inner = postResBody.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return inner;
  }
  return postResBody;
}

/**
 * 套用折扣碼後以 GET /cart 回傳對齊小計與折後金額（定額券須與伺服器購物車一致，否則僅用 Redux 小計易算出折抵 0）
 * @param {number} localSubtotal — Redux 商品小計
 * @param {object} postData — POST /coupon 的 res.data.data（可為巢狀，會自動 unwrap）
 * @param {object | undefined} cartRes — GET /cart 的 axios 回傳（整包）
 */
export function resolveCouponApplyDisplayWithCartSync(
  localSubtotal,
  postData,
  cartRes,
) {
  const normalizedPost = pickPostCouponData(postData) ?? postData;
  const cartRoot = unwrapCartApiInner(cartRes);
  if (!cartRoot || typeof cartRoot !== "object") {
    return getStorefrontCouponApplyDisplay(localSubtotal, normalizedPost);
  }

  const apiTotal = pickNum(cartRoot.total);
  const apiFinal = pickNum(cartRoot.final_total);
  const postFinal = pickFinalTotalFromPayload(normalizedPost);

  const subtotalBase = Number.isFinite(apiTotal)
    ? apiTotal
    : Number(localSubtotal);
  const finalTotal = Number.isFinite(apiFinal) ? apiFinal : postFinal;

  const line = Array.isArray(cartRoot.carts)
    ? cartRoot.carts.find((c) => c?.coupon)
    : null;
  const c = line?.coupon;

  const merged = {
    ...(normalizedPost && typeof normalizedPost === "object"
      ? normalizedPost
      : {}),
    final_total: Number.isFinite(finalTotal)
      ? finalTotal
      : (normalizedPost?.final_total ?? normalizedPost?.finalTotal),
    discount_type: normalizedPost?.discount_type ?? c?.discount_type,
    percent: normalizedPost?.percent ?? c?.percent,
    fixed_amount:
      normalizedPost?.fixed_amount ??
      c?.fixed_amount ??
      c?.amount ??
      c?.discount_amount,
    ...(c ? { coupon: c } : {}),
  };

  return getStorefrontCouponApplyDisplay(subtotalBase, merged);
}

/**
 * 前台套用用優惠券後的折抵金額與說明（定額／比例）。
 * 優先使用 API 之 total／final_total 差額；若差額為 0 且回傳含優惠欄位，則以前台規則補算（因部分後端定額仍回傳未折扣之 final_total）。
 * @param {number} subtotal — 與 API 計算 final_total 時相同之購物車小計
 * @param {object} apiData — POST/GET 合併後之 payload
 * @returns {{ discountAmount: number, finalTotal: number, ruleKind: 'percent'|'fixed'|'unknown', ruleShortLabel: string | null, lines: string[] } | null}
 */
export function getStorefrontCouponApplyDisplay(subtotal, apiData) {
  if (!apiData || typeof apiData !== "object") return null;
  const sub = Number(subtotal);
  if (!Number.isFinite(sub)) return null;

  let finalTotal = pickNum(apiData.final_total ?? apiData.finalTotal);
  if (!Number.isFinite(finalTotal)) {
    finalTotal = sub;
  }

  let discountAmount = Math.max(0, Math.round(sub - finalTotal));
  let meta = pickCouponMetaFromApplyResponse(apiData);

  /** API 未反映折抵時，依定額／比例欄位補算（僅在能取得 meta 時） */
  if (discountAmount === 0 && meta) {
    if (
      meta.discount_type === COUPON_DISCOUNT_FIXED &&
      Number(meta.fixed_amount) > 0
    ) {
      discountAmount = Math.min(
        Math.round(Number(meta.fixed_amount)),
        Math.round(sub),
      );
      finalTotal = Math.max(0, sub - discountAmount);
    } else if (meta.discount_type === COUPON_DISCOUNT_PERCENT) {
      const p = Number(meta.percent);
      if (Number.isFinite(p) && p > 0 && p < 100) {
        finalTotal = Math.round((sub * p) / 100);
        discountAmount = Math.max(0, Math.round(sub - finalTotal));
      }
    }
  }

  /** 後台定額券會存 percent:100；有折抵時避免顯示成「小計×100%」 */
  if (
    discountAmount > 0 &&
    meta?.discount_type === COUPON_DISCOUNT_PERCENT &&
    Number(meta.percent) === 100
  ) {
    const faRaw =
      apiData.fixed_amount ??
      apiData.coupon?.fixed_amount ??
      apiData.coupon?.amount;
    const faNum = faRaw != null ? Number(faRaw) : NaN;
    meta = normalizeCouponFromApi({
      discount_type: COUPON_DISCOUNT_FIXED,
      fixed_amount:
        Number.isFinite(faNum) && faNum > 0
          ? Math.round(faNum)
          : discountAmount,
    });
    finalTotal = Math.max(0, sub - discountAmount);
  }

  const ruleShortLabel = meta ? formatCouponRuleLabel(meta) : null;

  let ruleKind = "unknown";
  if (meta?.discount_type === COUPON_DISCOUNT_FIXED) ruleKind = "fixed";
  else if (meta?.discount_type === COUPON_DISCOUNT_PERCENT)
    ruleKind = "percent";

  const subStr = sub.toLocaleString("zh-TW");
  const ftStr = Math.round(finalTotal).toLocaleString("zh-TW");
  const discStr = discountAmount.toLocaleString("zh-TW");

  /** @type {string[]} */
  const lines = [];
  if (ruleKind === "percent" && meta?.percent != null && meta.percent !== "") {
    const p = Number(meta.percent);
    lines.push(`優惠方式：比例 — 小計 × ${p}%（折後小計＝小計×${p}%）`);
    lines.push(
      `小計 NT$ ${subStr} → 折後小計 NT$ ${ftStr}，折抵 NT$ ${discStr}`,
    );
  } else if (ruleKind === "fixed" && meta && Number(meta.fixed_amount) > 0) {
    const fa = Number(meta.fixed_amount);
    lines.push(`優惠方式：定額 — 折抵 NT$ ${fa.toLocaleString("zh-TW")}`);
    lines.push(
      `小計 NT$ ${subStr} → 折後小計 NT$ ${ftStr}，實際折抵 NT$ ${discStr}`,
    );
  } else {
    lines.push(
      `小計 NT$ ${subStr} → 折後小計 NT$ ${ftStr}，折抵 NT$ ${discStr}`,
    );
    lines.push("（若回傳未含折扣類型，優惠別以伺服器計算為準）");
  }

  return {
    discountAmount,
    finalTotal,
    ruleKind,
    ruleShortLabel,
    lines,
  };
}
