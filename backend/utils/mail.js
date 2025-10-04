import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
        <h2 style="color: #ff8c00; text-align: center;">Craveo</h2>
        <p style="font-size: 16px; color: #333;">Dear User,</p>
        <p style="font-size: 15px; color: #555;">
          We received a request to reset your Craveo account password. Please use the OTP below to proceed:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 28px; letter-spacing: 4px; font-weight: bold; color: #ff8c00;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #777;">
          This OTP is valid for 5 minutes. Please do not share it with anyone.
        </p>
        <p style="font-size: 15px; color: #333;">Warm regards,<br><strong>Team Craveo</strong></p>
      </div>
    `,
  });
};
