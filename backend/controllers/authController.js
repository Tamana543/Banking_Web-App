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
    console.log("BODY RECEIVED:");
console.log(req.body);
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
  await user.save();
  return res.status(401).json({
    success: false,
    message: user.isLocked
      ? "Your account has been locked after 5 failed login attempts."
      : "Invalid email or password.",
  });
}
    // Generate JWT
    const token = generateToken(user._id);
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    
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
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get Current User Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

