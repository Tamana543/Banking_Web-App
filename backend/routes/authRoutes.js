import express from "express";
import validateRegister from "../middleware/validateRegister.js";
import protect from "../middleware/authMiddleware.js";
import { registerUser, loginUser, getCurrentUser } from "../controllers/authController.js";
const router = express.Router();
router.post("/register", validateRegister, registerUser)
router.post("/login", loginUser);
router.get("/me",protect,getCurrentUser)
export default router