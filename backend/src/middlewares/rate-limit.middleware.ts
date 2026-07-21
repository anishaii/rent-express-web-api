import rateLimit from "express-rate-limit";

// strict limiter for login/register - protects against brute force attacks
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // revert back later
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true, // return rate limit info in RateLimit-* headers
  legacyHeaders: false, // disable the deprecated X-RateLimit-* headers
});
