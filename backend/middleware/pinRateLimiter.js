import rateLimit from "express-rate-limit";
const pinRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message:
      "Too many PIN-protected requests. Please try again later.",
  },
});
export default pinRateLimiter;