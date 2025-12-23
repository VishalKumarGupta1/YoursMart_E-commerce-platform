import express from "express";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProduct,
  handleproductImageUpload,
} from "../../controllers/admin/products.admin.contoller.js";
import { upload } from "../../middlewares/multer.middleware.js";

export const adminproductRouter = express.Router();

// adminproductRouter.post(
//   "/upload-images",
//   upload.single("my_file"),
//   handleproductImageUpload
// );

adminproductRouter.post("/addProduct",upload.single("image"), addNewProduct);
adminproductRouter.get("/getAllProduct", fetchAllProduct);
adminproductRouter.put("/editProduct/:id", editProduct);
adminproductRouter.delete("/deleteProduct/:id", deleteProduct);
