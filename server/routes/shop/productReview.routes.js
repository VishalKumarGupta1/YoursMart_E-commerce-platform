import express, { Router } from "express";
import {
  addProductReview,
  getProductReviews,
} from "../../controllers/shop/productReview.controller.js";

export const productReviewRouter = express.Router();

productReviewRouter.post("/add", addProductReview);
productReviewRouter.get("/:productId", getProductReviews);
