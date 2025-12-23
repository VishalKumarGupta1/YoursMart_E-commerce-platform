import express from "express";
import {
  addAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "../../controllers/shop/address.controller.js";

export const addressRouter = express.Router();

addressRouter.post("/add", addAddress);
addressRouter.get("/get/:userId", fetchAllAddress);
addressRouter.put("/update/:userId/:addressId", editAddress);
addressRouter.delete("/delete/:userId/:addressId", deleteAddress);
