import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token.js";
import { sendOtpEmail } from "../utils/mail.js";

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character.",
      });
    }
    if (mobile.length !== 10) {
      return res
        .status(400)
        .json({ message: "Mobile number must be 10 digits long." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      role,
    });
    const token = await generateToken(user._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    return res.status(500).json({ message: `SignUp Error: ${error}` });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const token = await generateToken(user._id);

    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `SignIn Error: ${error}` });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User signed out successfully." });
  } catch (error) {
    return res.status(500).json({ message: `SignOut Error: ${error}` });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetPwdOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();

    await sendOtpEmail(email, otp);
    console.log(`OTP sent successfully to ${email}`);
    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res
      .status(500)
      .json({ message: `Send OTP Error: ${error.message}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "OTP is required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    if (!user.resetPwdOtp || user.resetPwdOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.resetPwdOtp = undefined;
    user.otpExpires = undefined;
    user.isOtpVerified = true;
    await user.save();
    console.log(`OTP verified successfully for ${email}`);
    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res
      .status(500)
      .json({ message: `Verify OTP Error: ${error.message}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    if (user.isOtpVerified === false) {
      return res.status(400).json({ message: "OTP Verification Required" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.isOtpVerified = false;
    await user.save();
    console.log(`Password reset successfully for ${email}`);
    return res.status(200).json({ message: "Password Reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res
      .status(500)
      .json({ message: `Reset Password Error: ${error.message}` });
  }
};

export const handleGoogleAuth = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      user = User.create({
        firstName,
        lastName,
        email,
        mobile,
      });
    }
    const token = generateToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Google auth error: ${error.message}` });
  }
};
