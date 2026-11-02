import express from "express";
import { sendContactMessage, subscribeNewsletter, } from "../controllers/publicController.js";
import { contactRateLimiter, newsletterRateLimiter, } from "../middleware/publicRateLimiter.js";

const router = express.Router();

router.post("/contact", contactRateLimiter, sendContactMessage);
router.post("/newsletter", newsletterRateLimiter, subscribeNewsletter);

export default router;