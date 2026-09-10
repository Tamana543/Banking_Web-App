import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { validatePassword } from "../utils/passwordPolicy.js";
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_DURATION = 15 * 60 * 1000;
const publicUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  balance: user.balance,
  currency: user.currency,
  role: user.role,
  avatar: user.avatar,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin,
  passwordUpdatedAt: user.passwordUpdatedAt,
  pinUpdatedAt: user.pinUpdatedAt,
});
const normalizeEmail = (email) =>
  email.trim().toLowerCase();
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, pin, } = req.body;
    if ( typeof firstName !== "string" || !firstName.trim() || typeof lastName !== "string" || !lastName.trim() || typeof email !== "string" || !isValidEmail(email) ) {
      return res.status(400).json({
        message: "Please provide valid registration details.",
      });
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({
        message: passwordError,
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }
    if (
      typeof pin !== "string" ||
      !/^\d{4}$/.test(pin)
    ) {
      return res.status(400).json({
        message: "PIN must contain exactly 4 digits.",
      });
    }
    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });
    if (existingUser) {
      return res.status(400).json({
        message:
          "An account with this email already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );
    const hashedPin = await bcrypt.hash(
      pin,
      12
    );
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      pin: hashedPin,
    });
    const token = generateToken(user);
    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "An account with this email already exists.",
      });
    }
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Registration failed.",
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ( typeof email !== "string" || !email.trim() || typeof password !== "string" || !password ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password +sessionVersion");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }
    const now = new Date();
    if ( user.isLocked && user.lockUntil && user.lockUntil > now ) {
      return res.status(403).json({
        message:
          "Your account is temporarily locked. Please try again later.",
      });
    }
    if ( user.isLocked && user.lockUntil && user.lockUntil <= now ) {
      user.isLocked = false;
      user.lockUntil = null;
      user.failedLoginAttempts = 0;
      await user.save();
    }
    if (user.isLocked && !user.lockUntil) {
      user.isLocked = false;
      user.failedLoginAttempts = 0;
      await user.save();
    }
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if ( user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS ) {
        user.isLocked = true;
        user.lockUntil = new Date(
          Date.now() + LOGIN_LOCK_DURATION
        );
      }
      await user.save();
      if (user.isLocked) {
        return res.status(403).json({
          message:
            "Too many failed login attempts. Please try again later.",
        });
      }
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = null;
    user.lastLogin = new Date();
    await user.save();
    const token = generateToken(user);
    return res.status(200).json({
      message: "Login successful.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Login failed.",
    });
  }
};
// Logic : the request okay (valid from JWT side) ? success : 401 Unauthorized
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    return res.status(200).json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      message:
        "Unable to retrieve user information.",
    });
  }
};
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No avatar file was uploaded.",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();
    return res.status(200).json({
      message: "Avatar updated successfully.",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return res.status(500).json({
      message: "Unable to update avatar.",
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !isValidEmail(email)
      ) {
        return res.status(400).json({
          message: "Please enter a valid email.",
        });
      }
      const normalizedEmail = normalizeEmail(email);
      if (normalizedEmail !== user.email) {
        const existingUser = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: user._id },
        });
        if (existingUser) {
          return res.status(400).json({
            message:
              "An account with this email already exists.",
          });
        }
        user.email = normalizedEmail;
      }
    }
    if (firstName !== undefined) {
      if (
        typeof firstName !== "string" ||
        !firstName.trim()
      ) {
        return res.status(400).json({
          message: "First name is required.",
        });
      }
      user.firstName = firstName.trim();
    }
    if (lastName !== undefined) {
      if (
        typeof lastName !== "string" ||
        !lastName.trim()
      ) {
        return res.status(400).json({
          message: "Last name is required.",
        });
      }
      user.lastName = lastName.trim();
    }
    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "An account with this email already exists.",
      });
    }
    console.error("Profile update error:", error);
    return res.status(500).json({
      message: "Unable to update profile.",
    });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword, } = req.body;
    if ( !currentPassword || !newPassword || !confirmPassword ) {
      return res.status(400).json({
        message: "All password fields are required.",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match.",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long.",
      });
    }
    const user = await User.findById(
      req.user._id
    ).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect.",
      });
    }
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );
    user.password = hashedPassword;
    user.passwordUpdatedAt = new Date();
    await user.save();
    res.status(200).json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      message: "Unable to change password.",
    });
  }
};
export const changePin = async (req, res) => {
  try {
    const { currentPin, newPin, confirmPin, } = req.body;
    if ( !currentPin || !newPin || !confirmPin ) {
      return res.status(400).json({
        message: "All PIN fields are required.",
      });
    }
    if (
      !/^\d{4}$/.test(String(currentPin))
    ) {
      return res.status(400).json({
        message:
          "Current PIN must contain exactly 4 digits.",
      });
    }
    if (
      !/^\d{4}$/.test(String(newPin))
    ) {
      return res.status(400).json({
        message:
          "PIN must contain exactly 4 digits.",
      });
    }
    if (newPin !== confirmPin) {
      return res.status(400).json({
        message: "New PINs do not match.",
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
    const hashedPin = await bcrypt.hash(
      String(newPin),
      12
    );
    user.pin = hashedPin;
    user.pinUpdatedAt = new Date();
    user.failedPinAttempts = 0;
    user.pinLockedUntil = null;
    await user.save();
    res.status(200).json({
      message: "PIN changed successfully.",
    });
  } catch (error) {
    console.error("Change PIN error:", error);
    res.status(500).json({
      message: "Unable to change PIN.",
    });
  }
};
