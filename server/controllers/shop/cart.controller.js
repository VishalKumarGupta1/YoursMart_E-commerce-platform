import { Cart } from "../../models/cart.model.js";
import { Product } from "../../models/product.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";


export const addToCart = asynchandler(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    throw new ApiError(400, "All fields are required");
  }

  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(400, "Product not found");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const findCurrentProductIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (findCurrentProductIndex == -1) {
    cart.items.push({ productId, quantity });
  } else {
    cart.items[findCurrentProductIndex].quantity += quantity;
  }

  await cart.save();
  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Product Successfully added to cart "));
});

export const fetchCartItems = asynchandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "userId fields are required");
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found for this user");
  }
  const validItems = cart.items.filter((productItem) => productItem.productId);

  if (validItems.length < cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  const populateCartItem = validItems.map((item) => ({
    productId: item.productId._id,
    image: item.productId.image,
    title: item.productId.title,
    price: item.productId.price,
    salePrice: item.productId.salePrice,
    quantity: item.quantity,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...cart._doc, items: populateCartItem },
        "cart items sent Successfully "
      )
    );
});

export const updateCartItemQty = asynchandler(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    throw new ApiError(400, "All fields are required");
  }

    if (quantity <= 0) {
      throw new ApiError(400, "Quantity must be at least 1");
    }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(400, "cart not found");
  }

  const findCurrentProductIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (findCurrentProductIndex == -1) {
    throw new ApiError(404, "cart item not present");
  } else {
    cart.items[findCurrentProductIndex].quantity = quantity;
  }

  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  const populateCartItem = cart.items.map((item) => ({
    productId: item.productId?._id || null,
    image: item.productId?.image || null,
    title: item.productId?.title || "product not found",
    price: item.productId?.price || null,
    salePrice: item.productId?.salePrice || null,
    quantity: item.quantity,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...cart._doc, items: populateCartItem },
        "cart items update Successfully "
      )
    );
});

export const deleteCartItem = asynchandler(async (req, res) => {
  const { userId, productId } = req.params;

  if (!userId || !productId) {
    throw new ApiError(400, "All fields are required");
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salePrice",
  });
  if (!cart) {
    throw new ApiError(400, "cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.productId._id.toString() !== productId
  );

  await cart.save();

  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  const populateCartItem = cart.items.map((item) => ({
    productId: item.productId?._id || null,
    image: item.productId?.image || null,
    title: item.productId?.title || "product not found",
    price: item.productId?.price || null,
    salePrice: item.productId?.salePrice || null,
    quantity: item.quantity,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...cart._doc, items: populateCartItem },
        "Cart item deleted successfully"
      )
    );
});
