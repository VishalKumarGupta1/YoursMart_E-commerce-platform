import express, { Router } from "express";
import {
  getFilteredproduct,
  getProductDetail,
} from "../../controllers/shop/products.controller.js";

export const shopProductRoute = express.Router();

shopProductRoute.get("/get", getFilteredproduct);
shopProductRoute.get("/get/:id", getProductDetail);
