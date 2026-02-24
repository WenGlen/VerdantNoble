import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const storefrontToastSlice = createSlice({
  name: "storefrontToast",
  initialState: [],
  reducers: {
    addMessage: (state, action) => {
      state.push({
        id: action.payload.id,
        message: action.payload.message,
      });
    },
    removeMessage: (state, action) => {
      const index = state.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) state.splice(index, 1);
    },
  },
});

export const showStorefrontToast = createAsyncThunk(
  "storefrontToast/show",
  async (message, { dispatch }) => {
    const id = Date.now();
    dispatch(storefrontToastSlice.actions.addMessage({ id, message }));
    setTimeout(() => {
      dispatch(storefrontToastSlice.actions.removeMessage({ id }));
    }, 3300);
  }
);

export const { addMessage, removeMessage } = storefrontToastSlice.actions;
export default storefrontToastSlice.reducer;
