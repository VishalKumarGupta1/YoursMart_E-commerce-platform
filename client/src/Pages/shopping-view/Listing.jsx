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

  const { user } = useSelector((state) => state.auth);

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
  }, [filter]);

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

  const handleAddToCart = (id) => {
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
      <Dialog
        open={productPageDetailOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Product</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f5f5f5" }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr",
                md: "1fr 1fr",
              },
              gap: 3,
            }}
          >
            {/* LEFT COLUMN — IMAGE */}
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              <img
                src={productDetails?.image}
                alt={productDetails?.title}
                style={{
                  width: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* RIGHT COLUMN — DETAILS */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {/* Title */}
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#111" }}>
                {productDetails?.title}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Rating value={4} readOnly size="small" />
                <Typography variant="body2" sx={{ color: "#666" }}>
                  (124 reviews)
                </Typography>
              </Box>

              {/* Description */}
              <Typography variant="body2" sx={{ color: "#555" }}>
                {productDetails?.description}
              </Typography>

              {/* Category & Brand */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: "#e0e0e0",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {productDetails?.category}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: "#e0e0e0",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {productDetails?.brand}
                </Typography>
              </Box>

              {/* Price */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ₹{productDetails?.salePrice}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textDecoration: "line-through", color: "#888" }}
                >
                  ₹{productDetails?.price}
                </Typography>
              </Box>

              {/* Stock */}
              <Typography
                variant="body2"
                sx={{
                  color: productDetails?.totalStock > 0 ? "#2e7d32" : "#c62828",
                  fontWeight: 500,
                }}
              >
                {productDetails?.totalStock > 0
                  ? `In Stock (${productDetails?.totalStock})`
                  : "Out of Stock"}
              </Typography>
            </Box>
          </Box>

          {/* REVIEWS SECTION */}
          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Reviews
          </Typography>

          {/* Dummy Review */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "#000" }}>
              <PersonIcon />
            </Avatar>

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                John Doe
              </Typography>
              <Typography variant="body2" sx={{ color: "#555" }}>
                Great quality product, totally worth the price!
              </Typography>
            </Box>
          </Box>

          {/* ACTIONS */}
          <DialogActions sx={{ px: 0, pt: 3 }}>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#000",
                "&:hover": { backgroundColor: "#333" },
              }}
              onClick={() => handleAddToCart(productDetails?._id)}
            >
              Add to Cart
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Listing;
