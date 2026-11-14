import express from "express";
import { sendContactMessage, subscribeNewsletter, getAvatar } from "../controllers/publicController.js";
import { contactRateLimiter, newsletterRateLimiter, } from "../middleware/publicRateLimiter.js";
const router = express.Router();

router.post("/contact", contactRateLimiter, sendContactMessage);
router.post("/newsletter", newsletterRateLimiter, subscribeNewsletter);
router.get("/avatar/:key", getAvatar);
export default router;