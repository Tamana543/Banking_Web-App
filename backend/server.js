import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import dns from "node:dns";
import cors from "cors"
import path from "path";

// routes
import authRouter from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js"

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// APIs 
app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionRoutes);
app.use( "/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Bankist API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});