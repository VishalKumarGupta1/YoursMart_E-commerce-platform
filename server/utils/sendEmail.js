import nodemailer from "nodemailer";

export const sendEmail = async (
  email,
  subject,
  message,
) => {
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    // port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: message,
  };

  await transporter.sendMail(mailOptions);
};
