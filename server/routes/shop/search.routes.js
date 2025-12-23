import express from "express";
import { searchProducts } from "../../controllers/shop/searchProduct.controller.js";

export const searchRouter = express.Router();

searchRouter.get("/:keyword", searchProducts);
// searchRouter.get("/get/:userId", fetchCartItems);
// searchRouter.put("/update/", updateCartItemQty);
// searchRouter.delete("/:userId/:productId", deleteCartItem);
