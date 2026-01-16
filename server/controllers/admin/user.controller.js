import { ApiError } from "../../utils/ApiError.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";

export const getAllUser = asynchandler(async (req, res) => {
  let users = await User.find();
  if (!users.length) {
    throw new ApiError(404, "no Users found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users sent sussfully"));
});

export const makeAdmin = asynchandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "No user found");
  }

  if (user.role === "Admin") {
    throw new ApiError(400, "User is already an Admin");
  }
  user.role = "Admin";
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(201, "User role updated to Admin successfully"));
});
