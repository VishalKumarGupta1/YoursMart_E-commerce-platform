import React, { useEffect, useState } from "react";
import ProductFilter from "../../components/shopping-view/Filter";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Menu,
  MenuItem,
  Rating,
  Typography,
} from "@mui/material";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/shopping-view/ProductCard";
import { useSearchParams } from "react-router-dom";
import { createSearchParamsHelper } from "../../Utility/Utility";
import { toast } from "react-toastify";
import PersonIcon from "@mui/icons-material/Person";
import {
  fetchAllFilteredProducts,
  fetchProductsDetails,
  setproductDetails,
} from "../../store/shop/product-slice";
import { addToCart, fetchCartItems } from "../../store/shop/cart-slice";
import ProductDetailDialog from "../../components/shopping-view/PRoductDetailDialog";

const Listing = () => {
  const [sortMenuAnchor, setsortMenuAnchor] = useState(null);
  const [isSortMenuOpen, setisSortMenuOpen] = useState(false);
  const [filter, setFilter] = React.useState(() => {
    const saved = sessionStorage.getItem("filters");
    return saved ? JSON.parse(saved) : { category: [], brand: [] };
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [productPageDetailOpen, setproductPageDetailOpen] = useState(false);
  const [sort, setsort] = useState("price-lowtohigh");
  const dispatch = useDispatch();
  const { isLoading, productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const categorySearchParams = searchParams.get("category");

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  // console.log(cartItems,"cartItems");

  const handleSortMenuOpen = (event) => {
    setsortMenuAnchor(event.currentTarget);
    setisSortMenuOpen(true);
  };

  const handleSortMenuClose = () => {
    setisSortMenuOpen(false);
    setsortMenuAnchor(null);
  };

  const handleSortSelect = (value) => {
    setsort(value); // store selected value
    console.log(sort, "sort value");
    console.log(value);
    handleSortMenuClose(); // close menu
  };

  useEffect(() => {
    setFilter(JSON.parse(sessionStorage.getItem("filters")));
  }, [categorySearchParams]);

  useEffect(() => {
    if (filter !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filter, sortParams: sort })
      );
  }, [dispatch, filter, sort]);

  useEffect(() => {
    if (filter && Object.keys(filter).length > 0) {
      const createQueryString = createSearchParamsHelper(filter);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filter, categorySearchParams]);

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

  const handleOpen = () => setproductPageDetailOpen(true);
  const handleClose = () => {
    setproductPageDetailOpen(false);
    dispatch(setproductDetails);
  };

  return (
    <div className="grid grid-cols-1  md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6  ">
      <ProductFilter filter={filter} setFilter={setFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 ">
              {" "}
              {productList?.length} Products
            </span>
            <Button
              variant="outlined"
              startIcon={<ImportExportIcon />}
              sx={{
                borderColor: "#2d2d2d",
                color: "#2d2d2d",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#000",
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
              onClick={handleSortMenuOpen}
            >
              Sort by
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 lg:grid-cols-4">
          {productList?.map((product) => (
            <ProductCard
              handleGetProductDeatil={handleGetProductDeatil}
              key={product._id}
              product={product}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      {/* Profile Menu Dropdown (Desktop and Mobile) */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={isSortMenuOpen}
        onClose={handleSortMenuClose}
      >
        <MenuItem onClick={() => handleSortSelect("price-lowtohigh")}>
          Price: Low to High
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect("price-hightolow")}>
          Price: High to Low
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect("title-atoz")}>
          Title: A to Z
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect("title-ztoa")}>
          Title: Z to A
        </MenuItem>
      </Menu>

      {/* loader  */}
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

      {/* onclick  product dialog open */}

      <ProductDetailDialog
        open={productPageDetailOpen}
        onClose={handleClose}
        product={productDetails}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default Listing;
