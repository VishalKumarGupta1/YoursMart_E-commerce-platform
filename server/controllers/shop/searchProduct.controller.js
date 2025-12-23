import { ApiError } from "../../utils/ApiError.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Product } from "../../models/product.model.js";

export const searchProducts = asynchandler(async (req, res) => {
  const { keyword } = req.params;
  if (!keyword || typeof keyword !== "string") {
    throw new ApiError(404, "keyword is required and must be in string");
  }

  const regex = new RegExp(keyword, "i");

  const searchquery = {
    $or: [
      { title: regex },
      { description: regex },
      { category: regex },
      { brand: regex },
    ],
  };

  const searchResult = await Product.find(searchquery);

  if (!searchResult) {
    throw new ApiError(404, "No product found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, searchResult, "product sent successfully"));
});
