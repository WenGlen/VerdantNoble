import { configureStore } from "@reduxjs/toolkit";
import dashboardToastReducer from "../slices/ToastSlice";
import storefrontToastReducer from "../slices/StorefrontToastSlice";
import productsReducer from "../slices/productsSlice";

export const store = configureStore({
  reducer: {
    dashboardToast: dashboardToastReducer,
    storefrontToast: storefrontToastReducer,
    products: productsReducer,
  },
});

export default store;
