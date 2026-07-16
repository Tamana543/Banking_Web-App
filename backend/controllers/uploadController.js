import User from "../models/User.js";

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please choose an image.",
      });
    }
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findById(req.user._id);
    user.avatar = avatarPath;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile photo updated.",
      avatar: avatarPath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};