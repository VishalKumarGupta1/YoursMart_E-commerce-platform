import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/admin-view/Layout";
import Login from "./Pages/auth/Login.jsx";
import Signup from "./Pages/auth/Signup.jsx";
import AuthLayout from "./components/auth/Layout.jsx";
import Dashboard from "./Pages/admin-view/Dashboard.jsx";
import Products from "./Pages/admin-view/Products.jsx";
import Features from "./Pages/admin-view/Features.jsx";
import Orders from "./Pages/admin-view/Orders.jsx";
import ShoppingLayout from "./components/shopping-view/Layout.jsx";
import Notfound from "./Pages/Notfound.jsx";
import Home from "./Pages/shopping-view/Home.jsx";
import Listing from "./Pages/shopping-view/Listing.jsx";
import Account from "./Pages/shopping-view/Account.jsx";
import Checkout from "./Pages/shopping-view/Checkout.jsx";
import { CheckAuth } from "./components/common/check-auth.jsx";
import UnauthPage from "./Pages/Unauth-page.jsx";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice/index.js";
import PaypalReturnPage from "./Pages/shopping-view/paypal-return.jsx";
import PaypalCancelPage from "./Pages/shopping-view/paypal-cancel.jsx";
import PaypalSuccessPage from "./Pages/shopping-view/payment-success.jsx";
import Viewprofile from "./Pages/shopping-view/Viewprofile.jsx";
import ResetPassword from "./Pages/auth/ResetPassword.jsx";
import SearchProducts from "./components/shopping-view/Search.jsx";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(216, 214, 214, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1301,
          }}
        >
          <img src="/loader.gif" height={50} width={50} alt="loading"></img>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <CheckAuth
                isAuthenticated={isAuthenticated}
                user={user}
              ></CheckAuth>
            }
          />
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Signup />} />
            <Route path="password/reset/:token" element={<ResetPassword />} />
          </Route>
          <Route
            path="/admin"
            element={
              <CheckAuth
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
                user={user}
              >
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="features" element={<Features />} />
          </Route>
          <Route
            path="/shop"
            element={
              <CheckAuth
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
                user={user}
              >
                <ShoppingLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<Home />} />
            <Route path="listing" element={<Listing />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="account" element={<Account />} />
            <Route path="paypal-return" element={<PaypalReturnPage />} />
            <Route path="paypal-cancel" element={<PaypalCancelPage />} />
            <Route path="payment-success" element={<PaypalSuccessPage />} />
            <Route path="view-profile" element={<Viewprofile />} />
            <Route path="search" element={<SearchProducts />} />
          </Route>
          <Route path="*" element={<Notfound />} />
          <Route path="/unauth-page" element={<UnauthPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
