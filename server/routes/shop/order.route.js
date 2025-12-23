import express from "express";
import {
  capturePayment,
  createOrder,
  getAllOrderByUser,
  getOrderById,
} from "../../controllers/shop/order.controller.js";

export const orderRouter = express.Router();

orderRouter.post("/create", createOrder);
orderRouter.post("/capture", capturePayment);
orderRouter.get("/list/:userId", getAllOrderByUser);
orderRouter.get("/details/:id", getOrderById);
