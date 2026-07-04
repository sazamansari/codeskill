const { getRedisClient } = require('../../config/redis');
const keys = require('../utils/keys');

const AI_TTL = 86400; // 24 hours

class AICache {
  static async getEditorial(questionId) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return null;

    try {
      const data = await redis.get(keys.aiEditorial(questionId));
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`[Redis] AI Editorial Get Error:`, err);
      return null;
    }
  }

  static async setEditorial(questionId, data) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return;

    try {
      await redis.set(keys.aiEditorial(questionId), JSON.stringify(data), 'EX', AI_TTL);
    } catch (err) {
      console.error(`[Redis] AI Editorial Set Error:`, err);
    }
  }

  // Generic method for other AI responses
  static async getCache(keyFunction) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return null;

    try {
      const data = await redis.get(keyFunction());
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`[Redis] AI Cache Get Error:`, err);
      return null;
    }
  }

  static async setCache(keyFunction, data) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return;

    try {
      await redis.set(keyFunction(), JSON.stringify(data), 'EX', AI_TTL);
    } catch (err) {
      console.error(`[Redis] AI Cache Set Error:`, err);
    }
  }
}

module.exports = AICache;
