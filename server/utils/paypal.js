import paypal from "@paypal/checkout-server-sdk";
// import dotenv from "dotenv";
// dotenv.config();

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);

export const paypalClient = new paypal.core.PayPalHttpClient(environment);