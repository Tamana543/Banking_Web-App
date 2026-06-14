import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import dns from "node:dns";
import authRouter from "./routes/authRoutes.js";
import cors from "cors"

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Bankist API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});