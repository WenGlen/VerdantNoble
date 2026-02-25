import { configureStore } from "@reduxjs/toolkit";
import dashboardToastReducer from "../slices/DashboardToastSlice";
import storefrontToastReducer from "../slices/StorefrontToastSlice";
import productsReducer from "../slices/productsSlice";
import cartReducer from "../slices/cartSlice";

export const store = configureStore({
  reducer: {
    dashboardToast: dashboardToastReducer,
    storefrontToast: storefrontToastReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});

export default store;
