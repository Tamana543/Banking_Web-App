import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
     {
          firstName :{
               type: String,
               required: true,
               trim : true
          },
          lastName: {
               type : String,
               required : true,
               trim : true
          },
          email : {
               type : String,
               required : true,
               unique: true,
               lowercase : true,
               trim : true
          },
          password: {
               type: String,
               required: true,
          },

          pin: {
                    type: String,
                    required: true,
               },

          balance: {
               type: Number,
               default: 0,
          },

          currency: {
               type: String,
               default: "USD",
          },

          role: {
               type: String,
               enum: ["user", "admin"],
               default: "user",
          },

          avatar: {
               type: String,
               default: "",
          },

          isVerified: {
               type: Boolean,
               default: false,
          },

          failedLoginAttempts: {
               type: Number,
               default: 0,
          },
           isLocked: {
               type: Boolean,
               default: false,
          },
          lockUntil: {
               type: Date,
               default: null,
          },
     }, {
          timestamps :true
     }
)
const User = mongoose.model("User",userSchema);
export default User;