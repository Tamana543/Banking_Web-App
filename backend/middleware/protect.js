import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user (exclude password & pin)
    req.user = await User.findById(decoded.id).select("-password -pin");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    next();
  } catch (error) {
    console.error("Protect Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid token.",
    });
  }
};

export default protect;