import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ msg: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user data to the request
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
