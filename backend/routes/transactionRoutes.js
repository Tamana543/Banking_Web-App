import express from "express";
import protect from "../middleware/authMiddleware.js";
import { depositMoney,getTransactions,transferMoney,withdrawMondy } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/deposit", protect, depositMoney );
router.post("/transfer",protect,transferMoney)
router.post("/withdraw",protect,withdrawMondy)
router.get("/",protect,getTransactions)

export default router;