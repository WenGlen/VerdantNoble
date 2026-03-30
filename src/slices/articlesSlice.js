import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getArticlesAll } from "../api/articles";

export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (_, { rejectWithValue }) => {
    try {
      const list = await getArticlesAll();
      return Array.isArray(list) ? list : [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ?? err?.message ?? "fetch failed",
      );
    }
  },
);

const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = action.payload ?? [];
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? null;
      });
  },
});

export default articlesSlice.reducer;
