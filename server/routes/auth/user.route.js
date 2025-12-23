import express from "express";
import {
  changeCurrentpassword,
  forgetPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyOtp,
} from "../../controllers/auth/user.controller.js";
import { isAuthenticated } from "../../middlewares/auth.middleware.js";

export const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/otp-verification", verifyOtp);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/myProfile", isAuthenticated, getUser);
userRouter.put("/change-password", isAuthenticated, changeCurrentpassword);
userRouter.post("/password/forget", forgetPassword);
userRouter.put("/password/reset/:token", resetPassword);
userRouter.get("/check-auth", isAuthenticated, getUser);

