import express from "express";
import protect from "../middleware/authMiddleware.js";
import { depositMoney, getTransactions, transferMoney, withdrawMoney, applyLoan, addMoneyToSavingsGoal, } from "../controllers/transactionController.js";
const router = express.Router();

router.post("/deposit", protect, depositMoney);
router.post("/transfer", protect, transferMoney);
router.post("/withdraw", protect, withdrawMoney);
router.post("/loan", protect, applyLoan);
router.post( "/savings-contribution", protect, addMoneyToSavingsGoal );
router.get("/", protect, getTransactions);
export default router;