import { Order } from "../../models/order.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const getAllOrderOfAlluser = asynchandler(async (req, res) => {
  let orders = await Order.findById();
  if (!orders.length) {
    throw new ApiError(404, "no Orders found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders sent sussfully"));
});

export const getOrderByIdForAdmin = asynchandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "No Order found");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, order, "sent Order details"));
});

export const updateOrderStatus = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  if (!id || !orderStatus) {
    throw new ApiError(404, "id or orderstatus is required");
  }

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "No Order found");
  }

  await Order.findByIdAndUpdate(id, { orderStatus });

  return res
    .status(200)
    .json(
      new ApiResponse(201, "  Ordersatatus is updated successfully details")
    );
});
