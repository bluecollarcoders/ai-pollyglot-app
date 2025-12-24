// server/rateLimit.js
const buckets = new Map();

/**
 * Simple fixed-window limiter.
 * Example: 20 requests per 5 minutes per IP.
 */
export function rateLimit({ windowMs = 5 * 60 * 1000, max = 20 } = {}) {
  return (req, res, next) => {
    const key =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";

    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    // reset window
    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    const remaining = Math.max(0, max - bucket.count);

    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset", String(bucket.resetAt));

    if (bucket.count > max) {
      return res.status(429).json({
        error: "Too many requests. Please wait a bit and try again.",
      });
    }

    next();
  };
}
