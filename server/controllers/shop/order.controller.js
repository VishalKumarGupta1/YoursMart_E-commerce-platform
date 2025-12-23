import { Order } from "../../models/order.model.js";
import { paypalClient } from "../../utils/paypal.js";
import { ApiError } from "../../utils/ApiError.js";
import { asynchandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Cart } from "../../models/cart.model.js";
import { Product } from "../../models/product.model.js";

export const createOrder = asynchandler(async (req, res) => {
  const {
    userId,
    cartId,
    cartItems,
    addressInfo,
    orderStatus = "pending",
    paymentMethod = "paypal",
    paymentStatus = "pending",
    totalAmount,
    orderDate = new Date(),
    orderUpdateDate = new Date(),
    paymentId,
    payerId,
  } = req.body;

  console.log("order controller start");
  try {
    // Step 1: Get PayPal access token
    const authResponse = await fetch(
      `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      throw new ApiError(
        500,
        errorData.error_description || "PayPal authentication failed"
      );
    }
    console.log("order controller 1 step");
    const { access_token: accessToken } = await authResponse.json();
    console.log(accessToken);

    // Step 2: Prepare PayPal order JSON
    const createOrderJSON = {
      intent: "CAPTURE",
      payer: {
        email_address: addressInfo.email || "customer@example.com", //dynamic
        name: {
          given_name: addressInfo.firstName || "John", //dynamic
          surname: addressInfo.lastName || "Doe", //dynamic
        },
        address: {
          address_line_1: addressInfo.address,
          admin_area_2: addressInfo.city,
          postal_code: addressInfo.pincode,
          country_code: "US",
        },
      },
      purchase_units: [
        {
          reference_id: cartId || "PUHF",
          description: "Order from YoursMart",
          custom_id: `ORDER_${cartId || Date.now()}`,
          invoice_id: `INV_${Date.now()}`,
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalAmount.toFixed(2),
              },
            },
          },
          items: cartItems.map((item) => ({
            name: item.title,
            unit_amount: {
              currency_code: "USD",
              value: item.price.toString(),
            },
            quantity: item.quantity.toString(),
            sku: item.productId,
          })),
          // shipping: {
          //   name: {
          //     full_name: `${addressInfo.firstName || "John"} ${
          //       addressInfo.lastName || "Doe"
          //     }`, //dynamic
          //   },
          //   address: {
          //     address_line_1: addressInfo.address,
          //     admin_area_2: addressInfo.city,
          //     postal_code: addressInfo.pincode,
          //   },
          // },
        },
      ],
      application_context: {
        brand_name: "YoursMart",
        return_url: `http://localhost:5173/shop/paypal-return`,
        cancel_url: `http://localhost:5173/shop/paypal-cancel`,
      },
    };

    console.log("order controller 2 step");

    // Step 3: Create PayPal order
    const response = await fetch(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(createOrderJSON),
      }
    );

    const paymentInfo = await response.json();

    if (!response.ok) {
      throw new ApiError(
        500,
        paymentInfo.message || "Failed to create PayPal order"
      );
    }
    console.log("order controller 3 step");

    // Step 4: Save order in MongoDB using Order model
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems: cartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.price.toString(),
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: addressInfo._id || "",
        address: addressInfo.address,
        city: addressInfo.city,
        phone: addressInfo.phone,
        pincode: addressInfo.pincode,
        notes: addressInfo.notes || "",
      },
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    });

    await newlyCreatedOrder.save();
    console.log("order controller 4 step");

    // Step 5: Return approval URL to frontend
    const approvalURL = paymentInfo.links.find(
      (link) => link.rel === "approve"
    )?.href;

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { approvalURL, orderId: newlyCreatedOrder._id },
          "Order created successfully"
        )
      );
  } catch (error) {
    console.error("Error creating order:", error);
    throw new ApiError(500, error.message || "Internal Server Error");
  }
});

export const capturePayment = asynchandler(async (req, res) => {
  const { paymentId, payerId, orderId } = req.body;

  let order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order connot be found");
  }

  order.paymentStatus = "Paid";
  order.orderStatus = "confirmed";
  order.paymentId = paymentId;
  order.payerId = payerId;

  for (let item of order.cartItems) {
    let product = await Product.findById(item.productId);
    if (!product) {
      throw new ApiError(
        404,
        `Not Enough Stock for this product ${product.title}`
      );
    }
    product.totalStock -= item.quantity;
    await product.save();
  }

  await Cart.findByIdAndDelete(order.cartId);

  await order.save();

  return res.status(200).json(new ApiResponse(201, order, "Order confirmed"));
});

export const getAllOrderByUser = asynchandler(async (req, res) => {
  const { userId } = req.body;

  let orders = await Order.findById({ userId });
  if (!orders.length) {
    throw new ApiError(404, "no Orders found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders sent sussfully"));
});

export const getOrderById = asynchandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "No Order found");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, order, "sent Order details"));
});

// export const createOrder = asynchandler(async (req, res) => {
//   const {
//     userId,
//     cartId,
//     cartItems,
//     addressInfo,
//     orderStatus,
//     paymentMethod,
//     paymentStatus,
//     totalAmount,
//     orderDate,
//     orderUpdateDate,
//     paymentId,
//     payerId,
//   } = req.body;

//   console.log("order controller start");

//   // Step 1: Get PayPal access token
//   const authResponse = await fetch(
//     `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Basic ${Buffer.from(
//           `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
//         ).toString("base64")}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: "grant_type=client_credentials",
//     }
//   );

//   const authData = await authResponse.json();
//   const accessToken = authData.access_token;

//   // Step 2: Create the PayPal order JSON -> create_order_json -> line number 22
//   const create_order_json = {
//     intent: "CAPTURE", // (1) "CAPTURE" or "AUTHORIZE" (You can capture the payment immediately or authorize it for later capture)
//     payer: {
//       email_address: "customer@example.com",
//       name: {
//         given_name: "John",
//         surname: "Doe",
//       },
//       address: addressInfo,
//     },
//     purchase_units: [
//       // (2) A list of purchase units (the details of the transaction)
//       {
//         reference_id: "PUHF", // (2a) Reference ID for your order (can be a custom order ID) || Internal ID for your tracking (optional)
//         description: "Order description",
//         custom_id: "CUSTOM_ORDER_001",
//         invoice_id: "INV_001",

//         amount: {
//           currency_code: "USD", // (2b) Currency code
//           value: totalAmount.toFixed(2), // (2c) Total amount to be paid
//         },
//         items: cartItems.map((item) => ({
//           name: item.title, // (2f) Item name
//           unit_amount: {
//             currency_code: "USD", // (2g) Currency
//             value: item.price, // (2h) Price per item
//           },
//           quantity: item.quantity, // (2i) Quantity of the item
//           sku: item.productId, // (2j) SKU or product identifier
//         })),
//         shipping: {
//           name: { full_name: "John Doe" },
//           address: {
//             address_line_1: "123 Street",
//             admin_area_2: "City",
//             postal_code: "12345",
//             country_code: "US",
//           },
//         },
//       },
//     ],
//     application_context: {
//       brand_name: "YoursMart",
//       return_url: "http://localhost:5173/api/v1/shop/paypal-return", // (3a) Return URL after success
//       cancel_url: "http://localhost:5173/api/v1/shop/paypal-cancel", // (3b) Cancel URL
//     },
//   };

//   console.log("running 2 step");
//   // Step 3: Create the PayPal order by calling PayPal API
//   const response = await fetch(
//     `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify(create_order_json),
//     }
//   );

//   const paymentInfo = await response.json();
//   console.log(paymentInfo);
//   console.log("running 3 step");
//   if (response.ok) {
//     // Step 4: Save the order in the database

//     const newlyCreatedOrder = new Order({
//       userId,
//       cartId,
//       cartItems,
//       addressInfo,
//       orderStatus,
//       //   paymentMethod,
//       paymentStatus,
//       totalAmount,
//       orderDate,
//       orderUpdateDate,
//       paymentId,
//       payerId,
//     });

//     await newlyCreatedOrder.save();

//     // Step 5: Get the approval URL for redirecting the user to PayPal
//     const approvalURL = paymentInfo.links.find(
//       (link) => link.rel === "approve"
//     ).href;

//     return res
//       .status(201)
//       .json(
//         new ApiResponse(
//           201,
//           { approvalURL, orderId: newlyCreatedOrder._id },
//           "order created Successfully"
//         )
//       );
//   } else {
//     // Handle error if PayPal API response is not successful
//     throw new ApiError(
//       500,
//       paymentInfo.message || "Error while creating PayPal order"
//     );
//   }
// });

// const create_order_json = {
//     intent: "CAPTURE", // (1) "CAPTURE" or "AUTHORIZE" (You can capture the payment immediately or authorize it for later capture)
//     payer: {
//       email_address: "customer@example.com",
//       name: {
//         given_name: "John",
//         surname: "Doe",
//       },
//       address: {
//         address_line_1: "123 Street",
//         admin_area_2: "City",
//         postal_code: "12345",
//         country_code: "US",
//       },
//     },
//     purchase_units: [
//       // (2) A list of purchase units (the details of the transaction)
//       {
//         reference_id: "PUHF", // (2a) Reference ID for your order (can be a custom order ID) || Internal ID for your tracking (optional)
//         description: "Order description",
//         custom_id: "CUSTOM_ORDER_001",
//         invoice_id: "INV_001",

//         amount: {
//           currency_code: "INR", // (2b) Currency code
//           value: totalAmount.toFixed(2), // (2c) Total amount to be paid
//           breakdown: {
//             item_total: {
//               currency_code: "USD",
//               value: cartItems
//                 .reduce((acc, item) => acc + item.price * item.quantity, 0)
//                 .toFixed(2), // (2d) Total amount of items (before shipping, etc.)
//             },
//             shipping: {
//               currency_code: "USD",
//               value: shippingAmount.toFixed(2), // (2e) If you have shipping fees, specify them here.
//             },
//           },
//         },
//         items: cartItems.map((item) => ({
//           name: item.title, // (2f) Item name
//           unit_amount: {
//             currency_code: "USD", // (2g) Currency
//             value: item.price.toFixed(2), // (2h) Price per item
//           },
//           quantity: item.quantity, // (2i) Quantity of the item
//           sku: item.productId, // (2j) SKU or product identifier
//         })),
//         shipping: {
//           name: { full_name: "John Doe" },
//           address: {
//             address_line_1: "123 Street",
//             admin_area_2: "City",
//             postal_code: "12345",
//             country_code: "US",
//           },
//         },
//       },
//     ],
//     application_context: {
//       // (3) Additional context and settings for the PayPal checkout flow
//       brand_name: "YoursMart",
//       return_url: "http://localhost:5173/shop/paypal-return", // (3a) Return URL after success
//       cancel_url: "http://localhost:5173/shop/paypal-cancel", // (3b) Cancel URL
//     },
//   };
