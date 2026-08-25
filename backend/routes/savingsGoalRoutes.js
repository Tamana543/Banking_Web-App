import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createSavingsGoal, getSavingsGoals, } from "../controllers/savingsGoalControllers.js";

const router = express.Router();
router.post("/", protect, createSavingsGoal);
router.get("/", protect, getSavingsGoals);
export default router;
