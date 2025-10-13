import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    console.log("Token generation error:", error);
    throw error;
  }
};
export default generateToken;
