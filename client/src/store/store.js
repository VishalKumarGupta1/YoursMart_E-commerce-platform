import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index.js";
import adminProductSlice from "./admin/product-slice";
import shoppingProductSlice from "./shop/product-slice";
import shoppingCartSlice from "./shop/cart-slice/index.js";
import addressSlice from "./shop/address-slice/index.js";
import shoppingOrderSlice from "./shop/order-slice/index.js";
import adminOrderSlice from "./admin/order-slice/index.js";
import searchSlice from "./shop/search-slice/index.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProduct: adminProductSlice,
    shopProducts: shoppingProductSlice,
    shopCart: shoppingCartSlice,
    shopAddress: addressSlice,
    shopOrder: shoppingOrderSlice,
    adminOrder: adminOrderSlice,
    shopSearch: searchSlice,
  },
});

export default store;
