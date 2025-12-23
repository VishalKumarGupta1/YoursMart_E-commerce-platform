import { ApiResponse } from "./ApiResponse.js";
import { sendEmail } from "./sendEmail.js";

export function validatePhoneNumber(enteredPhoneNumber) {
  const regex = /^(?:\+91|91)?[6-9]\d{9}$/;
  return regex.test(enteredPhoneNumber);
}

export function validateEmail(enteredEmail) {
  // Simple regex for email validation
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(enteredEmail); // ✅ returns true or false
}

export async function sendVerficationCode(name, email, verificationCode, res) {
  const subject = "Your OTP Verification Code";
  const message = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 50px auto;
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              text-align: center;
          }
          h1 {
              color: #333333;
          }
          p {
              font-size: 16px;
              color: #555555;
          }
          .otp {
              font-size: 28px;
              font-weight: bold;
              color: #1a73e8;
              margin: 20px 0;
          }
          .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #999999;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Hello ${name || "User"},</h1>
          <p>We received a request to verify your email: <strong>${email}</strong>.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <div class="otp">${verificationCode}</div>
          <p>This OTP will expire in <strong>5 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
          <div class="footer">
              &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
          </div>
      </div>
  </body>
  </html>`;
  await sendEmail(email, subject, message);
  return res
    .status(200)
    .json(new ApiResponse(200, "verification code sent to mail"));
}
