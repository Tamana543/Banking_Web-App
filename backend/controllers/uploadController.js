import crypto from "crypto";
import User from "../models/User.js";
const detectImageType = (buffer) => {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "image/png";
  }
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please choose an image.",
      });
    }
    const type = detectImageType(req.file.buffer);
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Only JPEG, PNG or WebP images are allowed.",
      });
    }
    const key = crypto.randomBytes(16).toString("hex");
    const avatarPath = `/api/public/avatar/${key}`;

    await User.findByIdAndUpdate(req.user._id, {
      avatar: avatarPath,
      avatarKey: key,
      avatarType: type,
      avatarData: req.file.buffer,
    });

    res.status(200).json({
      success: true,
      message: "Profile photo updated.",
      avatar: avatarPath,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};