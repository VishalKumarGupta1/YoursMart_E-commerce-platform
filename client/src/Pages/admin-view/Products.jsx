import React, { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "../../store/admin/product-slice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProductCard from "../../components/admin-view/ProductCard";
import { brands, categories } from "../../Utility/Constant";

const Products = () => {
  const { isLoading, productList } = useSelector((state) => state.adminProduct);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
  });
  const [currentEditedId, setcurrentEditedId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({
      image: null,
      title: "",
      description: "",
      category: "",
      brand: "",
      price: "",
      salePrice: "",
      totalStock: "",
    });
    setcurrentEditedId(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    currentEditedId !== null
      ? dispatch(editProduct({ id: currentEditedId, formData })).then(
          (data) => {
            if (data?.payload?.success) {
              dispatch(fetchAllProducts());
              toast.success(data?.payload?.message);
              handleClose();
            } else {
              toast.error(data?.payload?.message);
            }
          }
        )
      : dispatch(addNewProduct(formData)).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            toast.success(data?.payload?.message);
            handleClose();
          } else {
            toast.error(data?.payload?.message);
          }
        });
  };

  const handleDeleteProduct = (id) => {
    dispatch(deleteProduct(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };

  return (
    <Fragment>
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
      <Box
        display="flex"
        alignItems="start"
        justifyContent="flex-end"
        width="100%"
      >
        <Button
          sx={{
            bgcolor: "black",
            color: "white",
            borderRadius: 2,
            px: 2,
            mt: 1,
            mr: 2,
            "&:hover": {
              bgcolor: "grey.800",
            },
          }}
          onClick={handleOpen}
        >
          Add New Product
        </Button>
      </Box>
      <div className=" flex gap-2 justify-evenly flex-wrap mt-4">
        {productList && productList.length > 0
          ? productList.map((product) => (
              <ProductCard
                key={product._id}
                setFormData={setFormData}
                setOpen={setOpen}
                setcurrentEditedId={setcurrentEditedId}
                product={product}
                handleDeleteProduct={handleDeleteProduct}
              />
            ))
          : null}
      </div>

      {/* add product dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {currentEditedId ? "Edit" : "Add New"} Product
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <Button
              disabled={currentEditedId}
              variant="outlined"
              color="black"
              component="label"
            >
              Upload Image
              <input
                type="file"
                name="image"
                hidden
                onChange={handleChange}
                accept="image/*"
              />
            </Button>

            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              required
            />

            <Autocomplete
              options={categories} // your categories array
              value={formData.category} // current value
              onChange={(event, newValue) => {
                setFormData({ ...formData, category: newValue || "" });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Category" required />
              )}
              freeSolo={false} // only allow selecting from the list
            />

            <Autocomplete
              options={brands} // your brands array
              value={formData.brand} // current value
              onChange={(event, newValue) => {
                setFormData({ ...formData, brand: newValue || "" });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Brand" required />
              )}
              freeSolo={false} // only allow selecting from the list
            />

            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />

            <TextField
              label="Sale Price"
              name="salePrice"
              type="number"
              value={formData.salePrice}
              onChange={handleChange}
            />

            <TextField
              label="Stock"
              name="totalStock"
              type="number"
              value={formData.totalStock}
              onChange={handleChange}
              required
            />

            <DialogActions sx={{ px: 0 }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {currentEditedId ? "Edit" : "Add"} Product
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default Products;
