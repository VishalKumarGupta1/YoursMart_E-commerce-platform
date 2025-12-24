import { ApiError } from "../../utils/ApiError.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Address } from "../../models/address.model.js";

export const addAddress = asynchandler(async (req, res) => {
  const { userId, address, city, pincode, phone, notes } = req.body;

  if (!userId || !address || !city || !pincode || !phone || !notes) {
    throw new ApiError(400, "All fields are required");
  }

  const newlyCreatedAddress = await Address.create({
    userId,
    address,
    city,
    pincode,
    phone,
    notes,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, newlyCreatedAddress, "address Successfully created ")
    );
});

export const fetchAllAddress = asynchandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "userId fields are required");
  }

  const address = await Address.find({ userId });

  return res
    .status(200)
    .json(new ApiResponse(200, address, "address Successfully sent "));
});

export const editAddress = asynchandler(async (req, res) => {
  const { userId, addressId } = req.params;
  const formData = req.body;
  if (!userId || !addressId) {
    throw new ApiError(400, "userId and addressId fields are required");
  }

  const address = await Address.findOneAndUpdate(
    { _id: addressId, userId },
    formData,
    { new: true }
  );

  if (!address) {
    throw new ApiError(400, "address not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, address, "address update Successfully"));
});

export const deleteAddress = asynchandler(async (req, res) => {
  const { userId, addressId } = req.params;
  if (!userId || !addressId) {
    throw new ApiError(400, "userId and addressId fields are required");
  }

  const address = await Address.findOneAndDelete({ _id: addressId, userId });

  if (!address) {
    throw new ApiError(400, "address not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, address, "address deleted Successfully"));
});
