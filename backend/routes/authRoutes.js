
import express from "express";
import validateRegister from "../middleware/validateRegister.js";

import { registerUser } from "../controllers/authController";
import { registerUser, loginUser, } from "../controllers/authController.js";
const router = express.Router();
router.post("/register", validateRegister, registerUser)
router.post("/login", loginUser);
export default router