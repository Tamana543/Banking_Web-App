import express from "express";
import protect from "../middleware/authMiddleware.js";
import { depositMoney } from "../controllers/transactionController.js";

const router = express.Router();

router.post(
  "/deposit",
  protect,
  depositMoney
);

export default router;