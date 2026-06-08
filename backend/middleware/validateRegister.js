import validator from "validator"
import User from "../models/User";

const validateRegister = async (req,res,next)=>{
     const {firstName,lastName,email,password,pin} = req.body;

     if (!firstName || firstName.trim().length < 2) {
          return res.status(400).json({
               success: false,
               message: "First name must be at least 2 characters.",
          });
     }
     if (firstName.trim().length > 30) {
          return res.status(400).json({
               success: false,
               message: "First name cannot exceed 30 characters.",
          });
     }

     if (!lastName || lastName.trim().length < 2) {
          return res.status(400).json({
               success: false,
               message: "Last name must be at least 2 characters.",
          });
     }

     if (lastName.trim().length > 30) {
          return res.status(400).json({
               success: false,
               message: "Last name cannot exceed 30 characters.",
          });
     }

     if (!email || !validator.isEmail(email)) {
          return res.status(400).json({
               success: false,
               message: "Please provide a valid email address.",
          });
     }

     if (!password || password.length < 8) {
          return res.status(400).json({
               success: false,
               message: "Password must be at least 8 characters.",
          });
     }

     if (password.length > 50) {
          return res.status(400).json({
               success: false,
               message: "Password cannot exceed 50 characters.",
          });
     }

     if (!pin) {
          return res.status(400).json({
               success: false,
               message: "PIN is required.",
          });
     }

     if (!/^\d{4}$/.test(String(pin))) {
          return res.status(400).json({
               success: false,
               message: "PIN must contain exactly 4 digits.",
          });
     }
     const existingUser = await User.findOne({
          email: email?.toLowerCase().trim(),
     });

     if (existingUser) {
          errors.push("An account with this email already exists.");
     }
     // in case there are many errors: 
     if (errors.length > 0) {
          return res.status(400).json({
               success: false,
               errors,
          });
     }

     next();
}
export default validateRegister;