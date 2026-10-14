import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 10,
  skipSuccessfulRequests: true, // only failed logins count
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again later.",
  },
});

export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many accounts created from this connection. Please try again later.",
  },
});
export const passwordChangeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many password attempts. Please try again later.",
  },
});