import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: token not found" });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodeToken)
      return res.status(401).json({ message: "Unauthorized: invalid token" });
    console.log(decodeToken);
    req.userId = decodeToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({ message: "isAuth error" });
  }
};
