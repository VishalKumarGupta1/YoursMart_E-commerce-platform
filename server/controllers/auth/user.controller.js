import { asynchandler } from "../../utils/asynchandler.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  sendVerficationCode,
  validateEmail,
  validatePhoneNumber,
} from "../../utils/utility.js";
import { sendEmail } from "../../utils/sendEmail.js";
import crypto from "crypto";

export const registerUser = asynchandler(async (req, res, next) => {
  //get user detail from frontend
  //validation  --> not  empty
  //check if user already  exist : username and email
  // check images , check for avatar
  //upload them to cloudinary , check avatar upload correctly or not
  //create user object - create entry in db
  //remove passowrd and refresh token field  form response
  //check for user creation
  //return response

  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    throw new ApiError(400, "All Field are required");
  }

  if (!validatePhoneNumber(phone)) {
    throw new ApiError(400, "Invalid Phone Number");
  }
  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid Email Address");
  }

  const existingUser = await User.findOne({
    $or: [
      { email, accountVerified: true },
      {
        phone,
        accountVerified: true,
      },
    ],
  });

  if (existingUser) {
    throw new ApiError(400, "User Already registered with this email or phone");
  }

  const registrationAttempByUser = await User.find({
    email,
    accountVerified: false,
  });

  if (registrationAttempByUser.length > 3) {
    throw new ApiError(
      400,
      "you have exceeded the maximum number of attempts (3) . please try after an hour"
    );
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
  });

  const verificationCode = await user.generateVerificationCode();
  await user.save();
  sendVerficationCode(name, email, verificationCode, res);
});

export const verifyOtp = asynchandler(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }
  const userAllEntries = await User.find({
    email,
    accountVerified: false,
  }).sort({ createdAt: -1 });

  if (!userAllEntries.length) {
    throw new ApiError(404, "User not found");
  }

  const user = userAllEntries[0];

  if (userAllEntries.length > 1) {
    await User.deleteMany({
      _id: { $ne: user._id },
      email,
      accountVerified: false,
    }); //clean up duplicate unverified user entries, keeping only the latest one.
  }

  if (user.verificationCode !== Number(otp)) {
    throw new ApiError(400, "Invalid otp");
  }
  const verificationCodeExpiretime = new Date(
    user.verificationCodeExpire
  ).getTime();

  if (verificationCodeExpiretime < Date.now()) {
    throw new ApiError(400, "OTP expired ");
  }

  user.accountVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpire = null;
  await user.save({ validateModifiedOnly: true });

  // const token = user.generateAccessToken();

  // const userData = {
  //   _id: user._id,
  //   email: user.email,
  //   name: user.name,
  //   phone: user.phone,
  //   role: user.role,
  // };

  return (
    res
      .status(200)
      // .cookie("Token", token, {
      //   expires: new Date(
      //     Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
      //   ),
      //   httpOnly: true, // not accessible via JS
      //   secure: true, // only sent over HTTPS
      // })
      .json(new ApiResponse(200, "Account verified successfully "))
  );
});

export const loginUser = asynchandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    throw new ApiError(400, "Incorrect Password");
  }

  const token = user.generateAccessToken();

  const userData = {
    _id: user._id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
  };

  return res
    .status(200)
    .cookie("Token", token, {
      expires: new Date(
        Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true, // not accessible via JS
      secure: true, // only sent over HTTPS
    })
    .json(new ApiResponse(200, userData, "Login successfully"));
});

export const logoutUser = asynchandler(async (req, res, next) => {
  return res
    .status(200)
    .clearCookie("Token", {
      httpOnly: true, // not accessible via JS
      secure: true, // only sent over HTTPS
    })
    .json(new ApiResponse(200, [], "Logout successfully"));
});

export const getUser = asynchandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User data sent successfully"));
});

export const changeCurrentpassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "oldPassword and newPassword are required");
  }

  const user = await User.findById(req.user?._id);
  const isPassowrdCorrect = await user.comparePassword(oldPassword);
  if (!isPassowrdCorrect) throw new ApiError(400, "invalid password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});

export const forgetPassword = asynchandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
    accountVerified: true,
  });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const resetToken = user.generateResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your reset passowrd token is :- \n\n ${resetPasswordUrl} \n\n if you have not requsted it then please ignore it .`;
  try {
    await sendEmail(
      user.email,
      "Ecommerce Website Password Reset Link",
      message
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Password reset link sent to email"));
  } catch (error) {
    // In case email sending fails
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save({ validateBeforeSave: false });
    console.log(error.message);

    throw new ApiError(500, "Error sending email");
  }
});

export const resetPassword = asynchandler(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Reset password token is invalid and expired");
  }

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "password Reset successully"));
});
