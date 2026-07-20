import express from "express";
import validateRegister from "../middleware/validateRegister.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { registerUser, loginUser, getCurrentUser, uploadAvatar,updateProfile,changePassword,changePin } from "../controllers/authController.js";

const router = express.Router();
router.post("/register", validateRegister, registerUser)
router.post("/login", loginUser);
router.get("/me",protect,getCurrentUser)
router.post( "/avatar", protect, upload.single("avatar"), uploadAvatar );
router.put("/profile", protect, updateProfile);
router.put("/change-password",protect,changePassword)
router.put("/change-pin",protect,changePin)


export default router