import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createSavingsGoal, getSavingsGoals,addSavingsContribution,deleteSavingsGoal } from "../controllers/savingsGoalControllers.js";

const router = express.Router();
router.post("/", protect, createSavingsGoal);
router.get("/", protect, getSavingsGoals);
router.post( "/:id/contribute", protect, addSavingsContribution);
router.delete( "/:id", protect, deleteSavingsGoal );export default router;
