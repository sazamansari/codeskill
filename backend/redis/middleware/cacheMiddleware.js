const { getRedisClient } = require('../../config/redis');

/**
 * Express middleware for caching API responses in Redis.
 * @param {string|function} key - A string or a function(req) that returns the cache key.
 * @param {number} ttl - Time to live in seconds (default: 600s / 10m).
 */
const cacheMiddleware = (key, ttl = 600) => {
  return async (req, res, next) => {
    const redis = getRedisClient();
    
    // If Redis is not connected, gracefully bypass the cache
    if (!redis || redis.status !== 'ready') {
      return next();
    }

    try {
      const cacheKey = typeof key === 'function' ? key(req) : key;
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Intercept the res.json method to cache the response before sending it
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redis.set(cacheKey, JSON.stringify(body), 'EX', ttl).catch(err => {
            console.error(`[Redis] Cache Write Error for ${cacheKey}:`, err);
          });
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error('[Redis] Cache Middleware Error:', error);
      next(); // Graceful degradation - proceed to the actual controller on error
    }
  };
};

module.exports = cacheMiddleware;
