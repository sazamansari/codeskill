const { getRedisClient } = require('../../config/redis');
const keys = require('../utils/keys');

/**
 * Redis-based Rate Limiter Middleware
 * Uses INCR + EXPIRE to implement a fixed window counter.
 * 
 * @param {string} routeName - Identifier for the route being limited.
 * @param {number} maxRequests - Max allowed requests within the window.
 * @param {number} windowSeconds - The time window in seconds.
 */
const rateLimiter = (routeName, maxRequests = 200, windowSeconds = 60 * 15) => {
  return async (req, res, next) => {
    const redis = getRedisClient();
    
    // Fallback: If Redis is down, allow the request to proceed (graceful degradation)
    if (!redis || redis.status !== 'ready') {
      return next();
    }

    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const userId = req.user ? req.user._id.toString() : 'guest';
      const identifier = `${userId}:${ip}`;
      
      const key = keys.rateLimit(identifier, routeName);

      // We use a transaction (MULTI) to ensure atomicity
      const [incrResult, ttlResult] = await redis
        .multi()
        .incr(key)
        .ttl(key)
        .exec();

      // INCR returns the new count
      const requestCount = incrResult[1];
      let ttl = ttlResult[1];

      // If this is the first request in the window, set the expiration
      if (requestCount === 1 || ttl === -1) {
        await redis.expire(key, windowSeconds);
        ttl = windowSeconds;
      }

      // Add rate limit info to headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - requestCount));
      res.setHeader('X-RateLimit-Reset', Math.floor(Date.now() / 1000) + ttl);

      if (requestCount > maxRequests) {
        return res.status(429).json({
          success: false,
          message: "Too many requests, please try again later."
        });
      }

      next();
    } catch (error) {
      console.error(`[Redis] Rate Limiter Error for ${routeName}:`, error);
      // Proceed on error so the application stays alive
      next();
    }
  };
};

module.exports = rateLimiter;
