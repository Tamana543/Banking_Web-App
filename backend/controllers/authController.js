import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, pin, } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(String(pin), 12);
    const user = await User.create({ firstName, lastName, email: normalizedEmail, password: hashedPassword, pin: hashedPin, });
    const token = generateToken(user._id);
    res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
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
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed.",
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }
    if (user.isLocked) {
      return res.status(403).json({
        message: "Your account is temporarily locked. Please try again later.",
      });
    }
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.isLocked = true;
      }
      await user.save();
      if (user.isLocked) {
        return res.status(403).json({
          message:
            "Too many failed login attempts. Your account has been locked.",
        });
      }
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lastLogin = new Date();
    await user.save();
    const token = generateToken(user._id);
    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
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
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
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
    res.status(200).json({
      user: {
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
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      message: "Unable to retrieve user information.",
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
    res.status(200).json({
      message: "Avatar updated successfully.",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({
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
    const normalizedEmail = email?.trim().toLowerCase();
    if (
      normalizedEmail &&
      normalizedEmail !== user.email
    ) {
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });
      if (existingUser) {
        return res.status(400).json({
          message: "An account with this email already exists.",
        });
      }
      user.email = normalizedEmail;
    }
    if (firstName !== undefined) {
      user.firstName = firstName.trim();
    }
    if (lastName !== undefined) {
      user.lastName = lastName.trim();
    }
    await user.save();
    res.status(200).json({
      message: "Profile updated successfully.",
      user: {
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
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
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
        message: "Password must be at least 6 characters long.",
      });
    }
    const user = await User.findById(req.user._id).select(
      "+password"
    );
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
    if (!currentPin || !newPin || !confirmPin) {
      return res.status(400).json({
        message: "All PIN fields are required.",
      });
    }
    if (newPin !== confirmPin) {
      return res.status(400).json({
        message: "New PINs do not match.",
      });
    }
    if (!/^\d{4}$/.test(String(newPin))) {
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
    const isMatch = await bcrypt.compare(
      String(currentPin),
      user.pin
    );
    if (!isMatch) {
      return res.status(401).json({
        message: "Current PIN is incorrect.",
      });
    }
    const hashedPin = await bcrypt.hash(
      String(newPin),
      12
    );
    user.pin = hashedPin;
    user.pinUpdatedAt = new Date();
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
