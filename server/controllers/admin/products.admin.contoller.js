import { title } from "process";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { Product } from "../../models/product.model.js";

export const handleproductImageUpload = asynchandler(async (req, res) => {
  const localFilePath = req.file?.path;

  if (!localFilePath) {
    throw new ApiError(400, "Image path not find");
  }
  const imageCloudinaryResponse = await uploadOnCloudinary(localFilePath);

  if (!imageCloudinaryResponse) {
    throw new ApiError(400, "Can't upload in cloudinary ,try again");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        imageCloudinaryResponse,
        "product image upload successfully  "
      )
    );
});

export const addNewProduct = asynchandler(async (req, res) => {
  const { title, description, category, brand, price, salePrice, totalStock } =
    req.body;

  const localFilePath = req.file?.path;
  if (!localFilePath) {
    throw new ApiError(400, "Image path not find");
  }

  if (
    !title ||
    !description ||
    !category ||
    !brand ||
    !price ||
    !salePrice ||
    !totalStock
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const imageCloudinaryResponse = await uploadOnCloudinary(localFilePath);

  if (!imageCloudinaryResponse) {
    throw new ApiError(400, "Can't upload in cloudinary ,try again");
  }

  const newlyCreatedProduct = await Product.create({
    image: imageCloudinaryResponse.url,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newlyCreatedProduct, "Product created Successfully")
    );
});

export const fetchAllProduct = asynchandler(async (req, res) => {
  const allProducts = await Product.find();
  return res
    .status(200)
    .json(new ApiResponse(200, allProducts, "Product Sent Successfully"));
});

export const editProduct = asynchandler(async (req, res) => {
  const { id } = req.params;
  const {
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
  } = req.body;

  let product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "product not found  ");
  }
  product.image = image || product.image;
  product.title = title || product.title;
  product.description = description || product.description;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.price = price == "" ? 0 : price;
  product.salePrice = salePrice === "" ? 0 : salePrice;
  product.totalStock = totalStock || product.totalStock;

  await product.save();

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product update Successfully"));
});

export const deleteProduct = asynchandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, "product not found  ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product delete Successfully"));
});
