const { getRedisClient } = require('../../config/redis');
const keys = require('../utils/keys');

const TTL = 1800; // 30 minutes

class GeneralCache {
  /**
   * Generic get method
   */
  static async get(keyFunction) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return null;

    try {
      const data = await redis.get(keyFunction());
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`[Redis] GeneralCache Get Error (${keyFunction()}):`, err);
      return null;
    }
  }

  /**
   * Generic set method
   */
  static async set(keyFunction, data, customTTL = TTL) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return;

    try {
      await redis.set(keyFunction(), JSON.stringify(data), 'EX', customTTL);
    } catch (err) {
      console.error(`[Redis] GeneralCache Set Error (${keyFunction()}):`, err);
    }
  }

  /**
   * Generic invalidate method
   */
  static async invalidate(keyFunction) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return;

    try {
      await redis.del(keyFunction());
    } catch (err) {
      console.error(`[Redis] GeneralCache Invalidate Error (${keyFunction()}):`, err);
    }
  }
}

module.exports = GeneralCache;
