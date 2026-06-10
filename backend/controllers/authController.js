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

    // Check required fields
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

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check if account is locked
    if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is temporarily locked. Please try again later.",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      user.failedLoginAttempts += 1;

      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.isLocked = true;
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }

      await user.save();

      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Reset failed attempts
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = null;

    await user.save();

    // Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
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
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};