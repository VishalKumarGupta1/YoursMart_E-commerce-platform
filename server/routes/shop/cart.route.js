import express from "express";
import {
  addToCart,
  deleteCartItem,
  fetchCartItems,
  updateCartItemQty,
} from "../../controllers/shop/cart.controller.js";

export const cartRouter = express.Router();

cartRouter.post("/add", addToCart);
cartRouter.get("/get/:userId", fetchCartItems);
cartRouter.put("/update", updateCartItemQty);
cartRouter.delete("/:userId/:productId", deleteCartItem);
