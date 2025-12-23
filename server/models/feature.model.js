import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    image: String,
  },
  {
    timestamps: true,
  }
);

export const Feature = new mongoose.model("Feature", featureSchema);
