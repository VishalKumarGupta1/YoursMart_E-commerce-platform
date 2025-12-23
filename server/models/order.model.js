import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    cartId: {
      type: String,
    },
    cartItems: [
      {
        productId: String,
        title: String,
        image: String,
        price: String,
        // salePrice: String,
        quantity: Number,
      },
    ],
    addressInfo: {
      addressId: String,
      address: String,
      city: String,
      phone: String,
      pincode: String,
      notes: String,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    orderUpdateDate: {
      type: Date,
       
    },
    paymentId: {
      type: String,
    },
    payerId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
