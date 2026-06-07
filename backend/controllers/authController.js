import bcrypt from "bcryptjs";
import User from "../models/User";
import generateToken from "../utils/generatToked";

export const registerUser = async (req,res)=>{
     try {
          const {firstName,lastName,email,password,pin} = req.body;

          //User existance checker
          const existingUser = await User.findOne({email});

          if (existingUser){
               return res.status(400).json({
                    success : false,
                    message : "User already exists"
               })
          }

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

