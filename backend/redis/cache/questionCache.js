const { getRedisClient } = require('../../config/redis');
const keys = require('../utils/keys');

const TTL = 600; // 10 minutes

class QuestionCache {
  /**
   * Retrieve cached question by slug
   */
  static async getQuestionBySlug(slug) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return null;

    try {
      const data = await redis.get(keys.questionData(slug));
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`[Redis] Error getting question cache (${slug}):`, err);
      return null;
    }
  }

  /**
   * Cache a single question
   */
  static async setQuestionBySlug(slug, questionData) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return;

    try {
      await redis.set(keys.questionData(slug), JSON.stringify(questionData), 'EX', TTL);
    } catch (err) {
      console.error(`[Redis] Error setting question cache (${slug}):`, err);
    }
  }

  /**
   * Invalidates a single question and the general questions list.
   * Call this on POST, PUT, DELETE, Publish, Update, Archive.
   */
  static async invalidateQuestion(slug, id = null) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return;

    try {
      const keysToDelete = [keys.questionsList()];
      if (slug) keysToDelete.push(keys.questionData(slug));
      if (id) keysToDelete.push(keys.questionById(id));

      await redis.del(...keysToDelete);
      console.log(`[Redis] Invalidated cache for question: ${slug || id}`);
    } catch (err) {
      console.error(`[Redis] Error invalidating question cache:`, err);
    }
  }
}

module.exports = QuestionCache;
