import { Feature } from "../../models/feature.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const addFeatureImage = asynchandler(async (req, res) => {
  const { image } = req.body;

  const featureImages = new Feature({
    image,
  });

  await featureImages.save();

  return res
    .status(200)
    .json(new ApiResponse(200, featureImages, "Orders sent successfully"));
});

export const getFeatureImage = asynchandler(async (req, res) => {
  const images = await Feature.find();

  return res
    .status(200)
    .json(new ApiResponse(200, images, "features images sent successfully"));
});
