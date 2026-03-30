import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  addToCart as addToCartApi,
  updateCartItem as updateCartItemApi,
  removeCartItem as removeCartItemApi,
  clearCart as clearCartApi,
  notifyCartUpdated,
  notifyToast,
} from "../api/cart";
import { showStorefrontToast } from "./StorefrontToastSlice";

/** 將 API 購物車格式轉成 CartPage / CartItem 使用的格式 */
function mapCartsToItems(apiData) {
  const carts = apiData?.data?.carts;
  if (!Array.isArray(carts)) return [];
  return carts.map((c) => ({
    id: c.id,
    product_id: c.product_id,
    name: c.product?.title ?? "",
    image: c.product?.imageUrl ?? null,
    price: c.product?.price ?? 0,
    quantity: c.qty ?? 0,
    stock: c.product?.stock ?? 999,
    unit: c.product?.unit ?? "",
    category: c.product?.category ?? "",
  }));
}

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCart();
      return mapCartsToItems(res.data);
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? err?.message ?? "fetch failed",
      );
    }
  },
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartItemId, delta }, { getState, rejectWithValue }) => {
    const items = getState().cart.items;
    const item = items.find((i) => i.id === cartItemId);
    if (!item) return rejectWithValue("item not found");
    const maxQty = item.stock != null ? Number(item.stock) : 999;
    const newQty = Math.min(maxQty, Math.max(1, item.quantity + delta));
    if (newQty === item.quantity) return getState().cart.items;
    try {
      await updateCartItemApi(cartItemId, item.product_id, newQty);
      notifyCartUpdated();
      const res = await getCart();
      return mapCartsToItems(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "更新數量失敗";
      notifyToast(msg);
      return rejectWithValue(msg);
    }
  },
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (cartItemId, { rejectWithValue }) => {
    try {
      await removeCartItemApi(cartItemId);
      notifyCartUpdated();
      const res = await getCart();
      return mapCartsToItems(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "刪除失敗";
      notifyToast(msg);
      return rejectWithValue(msg);
    }
  },
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await clearCartApi();
      notifyCartUpdated();
      return [];
    } catch (err) {
      notifyToast("訂單已送出，但清空購物車時發生錯誤");
      return rejectWithValue(err?.message);
    }
  },
);

const MSG_LIMIT = "超過可購數量上限<br/>（庫存僅 ";
const MSG_LIMIT_SUFFIX = "）";
const MSG_ADDED = "已加入購物車";
const MSG_FAIL = "加入購物車失敗<br/>（超過可購數量上限）";

/**
 * 用 Redux 的 products + cart 做庫存與購物車數量判斷，通過後才呼叫 API 加入購物車。
 * @param {{ productId: string, qty?: number, stock?: number|null, unit?: string }}
 */
export const addToCartWithStockCheck = createAsyncThunk(
  "cart/addToCartWithStockCheck",
  async (
    { productId, qty = 1, stock: stockParam = null, unit = "" },
    { getState, dispatch, rejectWithValue },
  ) => {
    const state = getState();
    const products = state.products?.list ?? [];
    const cartItems = state.cart?.items ?? [];

    const product = products.find((p) => p.id === productId);
    const stock = stockParam != null ? stockParam : (product?.stock ?? null);
    const currentQtyInCart = cartItems
      .filter((i) => i.product_id === productId)
      .reduce((sum, i) => sum + (i.quantity || 0), 0);

    if (stock != null && currentQtyInCart + qty > stock) {
      dispatch(
        showStorefrontToast(`${MSG_LIMIT}${stock} ${unit}${MSG_LIMIT_SUFFIX}`),
      );
      return rejectWithValue("over_limit");
    }

    const existing = cartItems.find((c) => c.product_id === productId);
    try {
      if (existing) {
        await updateCartItemApi(
          existing.id,
          productId,
          (existing.quantity || 0) + qty,
        );
      } else {
        await addToCartApi(productId, qty);
      }
      notifyCartUpdated();
      dispatch(showStorefrontToast(MSG_ADDED));
      dispatch(fetchCart());
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || MSG_FAIL;
      dispatch(showStorefrontToast(msg));
      return rejectWithValue(msg);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const setLoading = (state, loading) => {
      state.loading = loading;
      if (loading) state.error = null;
    };
    builder
      .addCase(fetchCart.pending, (state) => setLoading(state, true))
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload ?? [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? null;
        state.items = [];
      })
      .addCase(updateQuantity.pending, (state) => setLoading(state, true))
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (Array.isArray(action.payload)) state.items = action.payload;
      })
      .addCase(updateQuantity.rejected, (state) => {
        state.loading = false;
      })
      .addCase(removeItem.pending, (state) => setLoading(state, true))
      .addCase(removeItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload ?? [];
      })
      .addCase(removeItem.rejected, (state) => {
        state.loading = false;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload ?? [];
        state.loading = false;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const selectCartItems = (state) => state.cart.items ?? [];
export const selectCartCount = (state) =>
  (state.cart.items ?? []).reduce((sum, i) => sum + (i.quantity || 0), 0);
export const selectCartLoading = (state) => state.cart.loading;

export default cartSlice.reducer;
