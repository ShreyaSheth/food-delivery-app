import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token.js";

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
