import { asynchandler } from "../../utils/asynchandler.js";
import { Product } from "../../models/product.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const getFilteredproduct = asynchandler(async (req, res) => {
  const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

  let filters = {};
  if (category.length) {
    filters.category = { $in: category.split(",") };
  }
  if (brand.length) {
    filters.brand = { $in: brand.split(",") };
  }

  let sort = {};

  switch (sortBy) {
    case "price-lowtohigh":
      sort.price = 1;

      break;
    case "price-hightolow":
      sort.price = -1;
      break;

    case "title-atoz":
      sort.title = 1;
      break;

    case "title-ztoa":
      sort.title = -1;
      break;

    default:
      sort.price = 1;
      break;
  }

  const products = await Product.find(filters).sort(sort);

  if (!products) {
    throw new ApiError(404, "some error in fetching products");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "All fitered products sent successfully  ")
    );
});

export const getProductDetail = asynchandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).lean();

  if (!product) {
    throw new ApiError(
      404,
      "some error in fetching products or product not found"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, " products detail sent successfully  ")
    );
});
