import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";

export const isAuthenticated = asynchandler(async (req, res, next) => {
  const token =
    req.cookies?.Token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  try {
    const decodedUserData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decodedUserData;

    next();
  } catch (error) {
    // Handle specific JWT errors for better UX
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Session expired. Please log in again.");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token. Please log in again.");
    }

    throw new ApiError(401, "Authentication failed");
  }
});
