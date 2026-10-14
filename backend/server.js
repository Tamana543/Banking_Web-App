import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import dns from "node:dns";
import cors from "cors"
import path from "path";
import helmet from "helmet";
// routes
import authRouter from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js"
import savingsGoalRoutes from "./routes/savingsGoalRoutes.js"
import adminRoutes from "./routes/adminRoutes.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();
connectDB();
const app = express();
app.set("trust proxy", 1); // to stop proxies 
app.use( helmet({ crossOriginResourcePolicy: { policy: "cross-origin" }, }) );
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// APIs 
app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionRoutes);
app.use("/api/savings-goals", savingsGoalRoutes);
app.use( "/uploads", express.static(path.join(process.cwd(), "uploads")));
app.get("/", (req, res) => {
  res.send("Bankist API Running...");
});
app.use("/api/admin", adminRoutes);
// unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// global error handler
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body." });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image is too large. Maximum size is 2MB." });
  }
  if (err.message === "Images only.") {
    return res.status(400).json({ message: "Only image files are allowed." });
  }  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large." });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error." });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});