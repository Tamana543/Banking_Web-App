import express from "express";
import protect from "../middleware/authMiddleware.js";
import { depositMoney,getTransactions,transferMoney,withdrawMoney } from "../controllers/transactionController.js";
import { applyLoan } from "../../frontend/src/api/transactionApi.js";

const router = express.Router();

router.post("/deposit", protect, depositMoney );
router.post("/transfer",protect,transferMoney)
router.post("/withdraw",protect,withdrawMoney)
router.post("/loan",protect,applyLoan)
router.get("/",protect,getTransactions)

export default router;