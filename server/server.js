import dotenv from "dotenv";
dotenv.config({ path: [".env"] });
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./DB/DBConnection.js";
import { userRouter } from "./routes/auth/user.route.js";
import { removeUnverifiedAccount } from "./Automation/removeUnverifiedAccount.js";
import { adminproductRouter } from "./routes/admin/admin.products.route.js";
import { shopProductRoute } from "./routes/shop/products.route.js";
import { cartRouter } from "./routes/shop/cart.route.js";
import { addressRouter } from "./routes/shop/address.route.js";
import { orderRouter } from "./routes/shop/order.route.js";
import { adminOrderRouter } from "./routes/admin/order.route.js";
import { searchRouter } from "./routes/shop/search.routes.js";
import { productReviewRouter } from "./routes/shop/productReview.routes.js";
import { CommonRouter } from "./routes/common/common.route.js";
import errorHandler from "./middlewares/error.middleware.js"
import { adminUserRouter } from "./routes/admin/admin.user.route.js";

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);

app.use("/api/v1/shop/products", shopProductRoute);
app.use("/api/v1/shop/cart", cartRouter);
app.use("/api/v1/shop/address", addressRouter);
app.use("/api/v1/shop/order", orderRouter);
app.use("/api/v1/shop/search", searchRouter);
app.use("/api/v1/shop/review", productReviewRouter);
app.use("/api/v1/common/feature", CommonRouter);

//for admin
app.use("/api/v1/admin/products", adminproductRouter);
app.use("/api/v1/admin/orders", adminOrderRouter);
app.use("/api/v1/admin/Users", adminUserRouter);



// Must be the last middleware
app.use(errorHandler);

removeUnverifiedAccount();
connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server are listening on port ${process.env.PORT}`);
});
