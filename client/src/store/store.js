import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index.js";
import adminProductSlice from "./admin/product-slice";
import shoppingProductSlice from "./shop/product-slice";
import shoppingCartSlice from "./shop/cart-slice/index.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProduct: adminProductSlice,
    shopProducts: shoppingProductSlice,
    shopCart: shoppingCartSlice,
  },
});

export default store;
