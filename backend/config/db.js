import mongoose from "mongoose";
const conectDB = async ()=>{
     try {
         const connection = await mongoose.connect(process.env.MONGO_URI) 
         console.log(`MongoDB Connected: ${conn.connection.host}`);
     } catch (error) {
          console.error(`Error from db.js : ${error.message}`);
          process.exit(1)
     }
}
export default conectDB;