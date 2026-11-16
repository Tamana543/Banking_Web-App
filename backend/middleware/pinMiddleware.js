import bcrypt from "bcryptjs";
import User from "../models/User.js";
const MAX_PIN_ATTEMPTS = 5;
const PIN_LOCK_DURATION = 15 * 60 * 1000; // 15 min
const verifyPin = (pinField = "pin") => {
  return async (req, res, next) => {
    try {
      const pin = req.body?.[pinField];
      if (!pin) {
        return res.status(400).json({
          message: "PIN is required.",
        });
      }
      if (!/^\d{4}$/.test(String(pin))) {
        return res.status(400).json({
          message: "PIN must contain exactly 4 digits.",
        });
      }
      const user = await User.findById(req.user._id).select(
        "+pin"
      );
      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }
      const now = new Date();
      if (
        user.pinLockedUntil &&
        user.pinLockedUntil > now
      ) {
        return res.status(403).json({
          message:
            "Too many failed PIN attempts. Please try again later.",
        });
      }
      if (
        user.pinLockedUntil &&
        user.pinLockedUntil <= now
      ) {
        user.failedPinAttempts = 0;
        user.pinLockedUntil = null;
        await user.save();
      }
      const isMatch = await bcrypt.compare(
        String(pin),
        user.pin
      );
      if (!isMatch) {
        user.failedPinAttempts += 1;
        if (
          user.failedPinAttempts >= MAX_PIN_ATTEMPTS
        ) {
          user.pinLockedUntil = new Date(
            Date.now() + PIN_LOCK_DURATION
          );
        }
        await user.save();
        if (user.pinLockedUntil) {
          return res.status(403).json({
            message:
              "Too many failed PIN attempts. Please try again later.",
          });
        }
        return res.status(401).json({
          message: "Incorrect PIN.",
        });
      }
    
      user.failedPinAttempts = 0;
      user.pinLockedUntil = null;
      await user.save();
      next();
    } catch (error) {
      console.error("PIN verification error:", error);
      return res.status(500).json({
        message: "Unable to verify PIN.",
      });
    }
  };
};
export default verifyPin;