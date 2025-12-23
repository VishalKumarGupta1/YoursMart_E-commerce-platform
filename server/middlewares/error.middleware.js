import { ApiError } from "../utils/ApiError.js";

/**
 * Global error handler middleware
 * Catches thrown errors and sends JSON response
 */
const errorHandler = (err, req, res, next) => {
  // If it's our custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors || [],
      data: err.data || null,
    });
  }

  // Handle validation errors from mongoose/joi/etc
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => ({
      field: el.path,
      message: el.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
      data: null,
    });
  }

  // Fallback: unknown error
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: [],
    data: null,
  });
};

export default errorHandler;
