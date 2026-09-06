import jwt from "jsonwebtoken";
import User from "../models/User.js";
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if ( !authHeader || !authHeader.startsWith("Bearer ") ) {
      return res.status(401).json({
        message: "Not authorized. Authentication token required.",
      });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Authentication token required.",
      });
    }
    const decoded = jwt.verify( token, process.env.JWT_SECRET );
    const user = await User.findById(decoded.id).select( "-password -pin" );
    if (!user) {
      return res.status(401).json({
        message: "Not authorized. User no longer exists.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Authentication token has expired.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid authentication token.",
      });
    }
    console.error("Authentication middleware error:", error);
    return res.status(401).json({
      message: "Not authorized.",
    });
  }
};
export default protect;