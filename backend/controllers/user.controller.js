import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("getCurrentUser called for userId:", userId);

    if (!userId) {
      return res.status(401).json({ message: "User ID not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user.email);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    return res
      .status(500)
      .json({ message: `Get current user error: ${error.message}` });
  }
};
