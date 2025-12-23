import express from "express";
import {
  getAllOrderOfAlluser,
  getOrderByIdForAdmin,
  updateOrderStatus,
} from "../../controllers/admin/order.controller.js";

export const adminOrderRouter = express.Router();

adminOrderRouter.get("/get", getAllOrderOfAlluser);

adminOrderRouter.get("/details/:id", getOrderByIdForAdmin);

adminOrderRouter.put("/update/:id", updateOrderStatus);
// adminOrderRouter.post("/capture", capturePayment);
// adminOrderRouter.get("/details/:id", getOrderById);
