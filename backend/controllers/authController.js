import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
export const registerUser = async (req,res)=>{
     try {
          const {firstName,lastName,email,password,pin} = req.body;
          // passwrd hash generator
          const hashedPassword = await bcrypt.hash(password,10) ;
           const hashedPin = await bcrypt.hash(String(pin), 12);
          // User Creation 
          const user = await User.create({
               firstName, 
               lastName,
               email, 
               password: hashedPassword,
               pin : hashedPin,
          })
          const token = generateToken(user._id)
          res.status(201).json({
               success : true,
               message : "Account created successfully.",
               token,
               user : {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    balance: user.balance,
                    currency: user.currency,
                    role: user.role,
                    avatar: user.avatar,
                    isVerified: user.isVerified,
                    createdAt:user.createdAt,
                    lastLogin:user.lastLogin,
                    passwordUpdatedAt:user.passwordUpdatedAt,
                    pinUpdatedAt:user.pinUpdatedAt,
                    failedLoginAttempts:user.failedLoginAttempts,
               },
          });
     } catch (error) {
          console.error(`error from registerUser ${error}`)
          res.status(500).json({
          success: false,
          message: "Server Error",
    });
     }
}
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }
    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (user && user.isLocked) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been locked after multiple failed login attempts.",
  });
}
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
  user.failedLoginAttempts += 1;
  if (user.failedLoginAttempts >= 5) {
    user.isLocked = true;
  }
  user.lastLogin = new Date();
  await user.save();
  return res.status(401).json({
    success: false,
    message: user.isLocked
      ? "Your account has been locked after 5 failed login attempts."
      : "Invalid email or password.",
      lastLogin: user.lastLogin,
  });
}
    // Generate JWT
    const token = generateToken(user._id);
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lastLogin = new Date()
    await user.save();
    // Send response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        balance: user.balance,
        currency: user.currency,
        role: user.role,
        avatar:user.avatar,
        isVerified:user.isVerified,
        createdAt:user.createdAt,
        lastLogin: user.lastLogin,
        passwordUpdatedAt: user.passwordUpdatedAt,
        pinUpdatedAt: user.pinUpdatedAt,
        failedLoginAttempts: user.failedLoginAttempts,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};
// Logic : the request okay (valid from JWT side) ? success : 401 Unauthorized
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success:false,
                message:"User not found.",
            });
        }
        res.status(200).json({
            success:true,
            user:{
                id:user._id,
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                balance:user.balance,
                currency:user.currency,
                role:user.role,
                avatar:user.avatar,
                isVerified:user.isVerified,
                createdAt:user.createdAt,
                lastLogin: user.lastLogin,
                lastLogin:user.lastLogin,
                passwordUpdatedAt:user.passwordUpdatedAt,
                pinUpdatedAt:user.pinUpdatedAt,
                failedLoginAttempts:user.failedLoginAttempts,
            }
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Server error.",
        });
    }
};
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please choose an image.",
            });
        }
        const user = await User.findById(req.user._id);
        const avatarPath = `/uploads/avatars/${req.file.filename}`;
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
            message: "Avatar upload failed.",
        });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
        } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        // duplicate email checker (for peofile udpated)\
        const existingUser = await User.findOne({
              email: email.toLowerCase().trim(),
          });
          if (
              existingUser &&
              String(existingUser._id) !== String(user._id)
          ) {
              return res.status(400).json({
                  success: false,
                  message: "Email already exists.",
              });
          }
          
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email.toLowerCase().trim();
        await user.save();
        res.status(200).json({
            success: true,
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
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
export const changePassword = async (req, res) => {
    try {
         const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = req.body;
        // Guardians 
         if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters.",
            });
        }
        const user = await User.findById(req.user._id);
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect.",
            });
        }
        user.password = await bcrypt.hash(
            newPassword,
            10
        );
        user.passwordUpdatedAt = new Date();
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });
        
    } catch (error) {
         console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
}
export const changePin = async (req, res) => {
    try {
        const {
            currentPin,
            newPin,
            confirmPin,
        } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }
        // Current PIN check
        const isMatch = await bcrypt.compare(
            currentPin,
            user.pin
        );
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current PIN is incorrect.",
            });
        }
        // Confirmation check
        if (newPin !== confirmPin) {
            return res.status(400).json({
                success: false,
                message: "PINs do not match.",
            });
        }
        // Length check
        if (!/^\d{4}$/.test(String(newPin))) {
            return res.status(400).json({
                success: false,
                message: "PIN must contain exactly 4 digits.",
            });
        }
        // Hash new PIN
        user.pin = await bcrypt.hash( String(newPin), 12 );
        user.pinUpdatedAt = new Date();
        await user.save();
        res.status(200).json({
            success: true,
            message: "PIN updated successfully.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
