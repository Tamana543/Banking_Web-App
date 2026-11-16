import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getRates } from "../controllers/currencyController.js";

const router = express.Router();

router.get("/rates", protect, getRates);

export default router;