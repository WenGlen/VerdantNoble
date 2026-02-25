import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const dashboardToastSlice = createSlice({
  name: "dashboardToast",
  initialState: [
    /*
    {
      id: 1,
      type: 'success',
      text: '成功',
    },
    */
  ],
  reducers: {
    setMessage: (state, action) => {
      state.push({
        id: action.payload.id,
        type: action.payload.success ? 'success' : 'error',
        message: action.payload.message,
      });
    },
    removeMessage: (state, action) => {
      const index = state.findIndex((message) => message.id === action.payload.id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const createAsyncDashboardToast = createAsyncThunk(
  'dashboardToast/createAsyncDashboardToast',
  async (payload, { dispatch, requestId }) => {
    const id = requestId ?? Date.now();
    dispatch(setMessage({
      ...payload,
      id,
    }));
    // 3000ms display + 300ms exit animation
    setTimeout(() => {
      dispatch(removeMessage({ id }));
    }, 3300);
  },
);

export const { setMessage, removeMessage } = dashboardToastSlice.actions;
export default dashboardToastSlice.reducer;