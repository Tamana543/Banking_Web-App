import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req,res)=>{
     try {
          const {firstName,lastName,email,password,pin} = req.body;
          // passwrd hash generator
          const hashedPassword = await bcrypt.hash(password,10) ;
          

          // User Creation 
          const user = await User.create({
               firstName, 
               lastName,
               email, 
               password: hashedPassword,
               pin
          })
          res.status(201).json({
               success : true,
               message : "Account created successfully.",
               user : {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
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

          // Find user
          const user = await User.findOne({ email });

          if (!user) {
               return res.status(401).json({
               success: false,
               message: "Invalid email or password.",
               });
          }

          // Compare password
          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
               return res.status(401).json({
               success: false,
               message: "Invalid email or password.",
               });
          }

          res.status(200).json({
               success: true,
               message: "Login successful.",

               token: generateToken(user._id),

               user: {
               id: user._id,
               firstName: user.firstName,
               lastName: user.lastName,
               email: user.email,
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