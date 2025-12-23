import { ProductReview } from "../../models/review.model.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { Product } from "../../models/product.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Order } from "../../models/order.model.js";

export const addProductReview = asynchandler(async (req, res) => {
  const { productId, userId, userName, reviewMessage, reviewvalue } = req.body;

  const order = await Order.findOne({
    userId,
    "cartItems.productId": productId,
    orderStatus: "confirmed",
  });

  if (!order) {
    throw new ApiError(403, " You need to purchase product to review it");
  }

  const existingReview = await ProductReview.findOne({ productId, userId });

  if (existingReview) {
    throw new ApiError(404, " You already reviewed this product ");
  }

  const newProductReview = await ProductReview.create({
    productId,
    userId,
    userName,
    reviewMessage,
    reviewvalue,
  });

  const reviews = await ProductReview.find({ productId });

  const totalReviewsLength = reviews.length;
  const averageReview =
    reviews.reduce((sum, item) => sum + item.reviewvalue, 0) /
    totalReviewsLength;

  await Product.findByIdAndUpdate(productId, { averageReview });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newProductReview,
        " products added a review to this product"
      )
    );
});

export const getProductReviews = asynchandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await ProductReview.find({ productId });

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, " All review sent successfully  "));
});
