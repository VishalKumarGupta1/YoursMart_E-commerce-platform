import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // useful if you are using this for searching , this optimize way and easy to search
    },
    email: {
      type: String,
      //   unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, //cloudinary url
      default:
        "https://preview.redd.it/why-are-the-blank-profile-pictures-different-v0-x6pug5d3kose1.jpg?width=225&format=pjpg&auto=webp&s=4d79be6d668557f3469afaf57478b2b7ffb78bcf",
    },
    password: {
      type: String,
      //   minLength: [6, "Password must have at least 6 character"],
      //   maxLength: [16, "Password cannot have more that  16 character"],
      required: [true, "password is required"],
      // select: false, // prevents it from being returned by default
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    accountVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: Number,
    },
    verificationCodeExpire: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateVerificationCode = function () {
  let code = "";
  for (let i = 0; i < 6; i++) {
    // Append a random digit (0-9)
    code += Math.floor(Math.random() * 10);
  }
  this.verificationCode = code;
  this.verificationCodeExpire = Date.now() + 5 * 60 * 1000;
  return code;
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      phone : this.phone,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );
};
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model("User", userSchema);
