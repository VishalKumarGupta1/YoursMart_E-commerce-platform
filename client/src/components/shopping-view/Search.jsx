import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import {
  getSearchResult,
  resetSearchResult,
} from "../../store/shop/search-slice/index.js";
import ProductCard from "./ProductCard.jsx";
import {
  addToCart,
  fetchCartItems,
} from "../../store/shop/cart-slice/index.js";
import { toast } from "react-toastify";
import {
  fetchProductsDetails,
  setproductDetails,
} from "../../store/shop/product-slice/index.js";
import ProductDetailDialog from "./PRoductDetailDialog.jsx";

const SearchProducts = () => {
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");
  const [productPageDetailOpen, setproductPageDetailOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { searchResults, loading } = useSelector((state) => state.shopSearch);

  useEffect(() => {
    if (keyword && keyword.trim() != "" && keyword.trim().length > 0) {
      dispatch(getSearchResult(keyword));
    } else {
      dispatch(resetSearchResult());
    }
  }, [keyword, dispatch]);

  const handleAddToCart = (id, gettotalStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === id
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > gettotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this product`
          );
          return;
        }
      }
    }

    dispatch(addToCart({ userId: user?._id, productId: id, quantity: 1 })).then(
      (res) => {
        if (res?.payload?.success) {
          dispatch(fetchCartItems(user?._id));
          toast.success(res?.payload?.message);
        } else {
          toast.error(res?.payload?.message);
        }
      }
    );
  };

  const handleGetProductDeatil = (id) => {
    console.log(id);
    dispatch(fetchProductsDetails(id)).then((res) => {
      if (productDetails?._id === id) {
        handleOpen();
        return;
      }
      if (res?.payload?.success) {
        handleOpen();
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleOpen = () => setproductPageDetailOpen(true);
  const handleClose = () => {
    setproductPageDetailOpen(false);
    dispatch(setproductDetails);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Box */}
      <div className="flex justify-center mb-8">
        <TextField
          fullWidth
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products..."
          variant="outlined"
          sx={{ maxWidth: 500 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchResults?.length > 0 &&
          searchResults.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              handleAddToCart={handleAddToCart}
              handleGetProductDeatil={handleGetProductDeatil}
            />
          ))}
      </div>

      {/* loader  */}
      {loading && (
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

      {/* Empty State */}
      {keyword && !loading && searchResults?.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No products found 😕</p>
      )}

      <ProductDetailDialog
        open={productPageDetailOpen}
        onClose={handleClose}
        product={productDetails}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default SearchProducts;
