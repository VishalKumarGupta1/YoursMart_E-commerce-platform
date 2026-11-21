import React, { useEffect, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import ProductFilter from "../../components/shopping-view/Filter";
import ProductCard from "../../components/shopping-view/ProductCard";
import ProductDetailDialog from "../../components/shopping-view/ProductDetailDialog";
import { createSearchParamsHelper } from "../../Utility/Utility";
import { toast } from "react-toastify";
import {
  fetchAllFilteredProducts,
  fetchProductsDetails,
  setproductDetails,
} from "../../store/shop/product-slice";
import { addToCart, fetchCartItems } from "../../store/shop/cart-slice";

const sortLabels = {
  "price-lowtohigh": "Price: Low to High",
  "price-hightolow": "Price: High to Low",
  "title-atoz": "Title: A to Z",
  "title-ztoa": "Title: Z to A",
};

const Listing = () => {
  const [sortMenuAnchor, setsortMenuAnchor] = useState(null);
  const [isSortMenuOpen, setisSortMenuOpen] = useState(false);
  const [filter, setFilter] = React.useState(() => {
    const saved = sessionStorage.getItem("filters");
    try {
      return saved ? JSON.parse(saved) : { category: [], brand: [] };
    } catch {
      return { category: [], brand: [] };
    }
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

  const handleSortMenuOpen = (event) => {
    setsortMenuAnchor(event.currentTarget);
    setisSortMenuOpen(true);
  };

  const handleSortMenuClose = () => {
    setisSortMenuOpen(false);
    setsortMenuAnchor(null);
  };

  const handleSortSelect = (value) => {
    setsort(value);
    handleSortMenuClose();
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("filters");
    try {
      setFilter(saved ? JSON.parse(saved) : { category: [], brand: [] });
    } catch {
      setFilter({ category: [], brand: [] });
    }
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
  }, [filter, categorySearchParams, setSearchParams]);

  const handleGetProductDeatil = (id) => {
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

  const handleRemoveFilter = (type, value) => {
    setFilter((prev) => ({
      ...(prev || { category: [], brand: [] }),
      [type]: (prev?.[type] || []).filter((item) => item !== value),
    }));
  };

  const handleClearFilters = () => setFilter({ category: [], brand: [] });

  const activeFilters = [
    ...(filter?.category || []).map((value) => ({ type: "category", value })),
    ...(filter?.brand || []).map((value) => ({ type: "brand", value })),
  ];

  return (
    <div className="min-h-screen bg-paper">
      {/* Collection header */}
      <section className="border-b border-line bg-ivory">
        <div className="mx-auto max-w-[1500px] px-6 py-12 lg:px-10 lg:py-16">
          <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-stone">
            <Link to="/shop/home" className="transition-colors hover:text-ink">
              Home
            </Link>
            <span className="text-line">/</span>
            <span className="text-ink">Collection</span>
          </nav>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-champagne" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-stone">
                  The house edit
                </span>
              </div>
              <h1 className="mt-4 font-display text-4xl leading-[0.95] text-ink sm:text-5xl lg:text-6xl">
                The Collection
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone">
                Considered essentials and quiet statements, gathered from the
                houses we trust. Refine by category or brand to find your piece.
              </p>
            </div>

            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-stone">
              <span className="h-1 w-1 rounded-full bg-champagne" />
              {productList?.length || 0} pieces
            </div>
          </div>
        </div>
      </section>

      {/* Collection body */}
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:gap-10 lg:px-10 lg:py-14">
        <ProductFilter filter={filter} setFilter={setFilter} />

        <div className="w-full">
          <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {activeFilters.length === 0 ? (
                <p className="text-[10px] uppercase tracking-[0.25em] text-stone">
                  Showing all pieces
                </p>
              ) : (
                <>
                  {activeFilters.map(({ type, value }) => (
                    <button
                      key={`${type}-${value}`}
                      type="button"
                      onClick={() => handleRemoveFilter(type, value)}
                      className="group flex items-center gap-2 border border-line bg-white px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink"
                    >
                      {value}
                      <CloseIcon
                        sx={{ fontSize: 13 }}
                        className="text-stone transition-colors group-hover:text-burgundy"
                      />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="ml-1 border-b border-ink pb-0.5 text-[9px] uppercase tracking-[0.22em] text-ink transition-colors hover:text-burgundy"
                  >
                    Clear all
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleSortMenuOpen}
              className="group inline-flex shrink-0 items-center justify-between gap-3 border border-line bg-white px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:border-ink sm:justify-start"
            >
              <span className="flex items-center gap-2">
                <ImportExportIcon sx={{ fontSize: 15 }} />
                Sort
              </span>
              <span className="text-stone">{sortLabels[sort]}</span>
            </button>
          </div>

          {productList?.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
              {productList.map((product) => (
                <ProductCard
                  handleGetProductDeatil={handleGetProductDeatil}
                  key={product._id}
                  product={product}
                  handleAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="mt-10 border border-line bg-white px-6 py-20 text-center">
                <p className="font-display text-3xl text-ink">
                  Nothing here, yet.
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone">
                  No pieces match the filters you have chosen. Clear the
                  selection to see the full collection again.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-7 border border-ink px-8 py-3 text-[10px] uppercase tracking-[0.28em] text-ink transition-colors hover:bg-ink hover:text-ivory"
                >
                  Clear filters
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Sort dropdown */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={isSortMenuOpen}
        onClose={handleSortMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            border: "1px solid #e4ddd1",
            borderRadius: 0,
            boxShadow: "0 18px 40px -24px rgba(20,18,16,0.45)",
            minWidth: 220,
          },
        }}
      >
        {Object.entries(sortLabels).map(([value, label]) => (
          <MenuItem
            key={value}
            selected={sort === value}
            onClick={() => handleSortSelect(value)}
            sx={{
              fontSize: 12,
              letterSpacing: "0.04em",
              py: 1.4,
              "&.Mui-selected": {
                backgroundColor: "#f6f1e8",
                color: "#141210",
              },
              "&.Mui-selected:hover": { backgroundColor: "#efe9df" },
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>

      {/* Loading overlay */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(246, 241, 232, 0.65)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1301,
          }}
        >
          <img src="/loader.gif" height={50} width={50} alt="loading"></img>
        </div>
      )}

      {/* Product detail dialog */}
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
