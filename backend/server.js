import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import dns from 'node:dns'; // for error "Error from db.js : querySrv ECONNREFUSED _mongodb._tcp.cluster0.ufecoqb.mongodb.net" "
dns.setServers(['1.1.1.1', '8.8.8.8']);
import authRouter from "./routes/authRoutes.js"



dotenv.config()

connectDB()

const app = express();
app.unsubscribe(express.json())
app.use("/api/auth",authRouter)

app.get("/", (req, res) => {
  res.send("Bankist API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});