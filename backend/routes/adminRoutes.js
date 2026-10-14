import express from "express";
import protect from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";
import { getAllUsers } from "../controllers/adminController.js";
const router = express.Router();
router.use(protect, requireAdmin);
router.get("/users", getAllUsers);
export default router;