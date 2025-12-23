import express from "express";
import {
  addFeatureImage,
  getFeatureImage,
} from "../../controllers/common controller/feature.controller.js";

export const CommonRouter = express.Router();

CommonRouter.post("/add", addFeatureImage);

CommonRouter.get("/get", getFeatureImage);
