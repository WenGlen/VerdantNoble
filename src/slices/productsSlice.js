import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProductsAll } from "../api/products";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getProductsAll();
      const raw = res.data?.products;
      const list = raw && typeof raw === "object" ? Object.values(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? err?.message ?? "fetch failed",
      );
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = action.payload ?? [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? null;
      });
  },
});

export default productsSlice.reducer;
