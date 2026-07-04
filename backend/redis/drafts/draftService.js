const { getRedisClient } = require('../../config/redis');
const keys = require('../utils/keys');

const DRAFT_TTL = 86400 * 7; // 7 days

class DraftService {
  /**
   * Save autosave draft
   */
  static async saveDraft(adminId, questionId = 'new', data) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return;

    try {
      await redis.set(
        keys.adminDraft(adminId, questionId), 
        JSON.stringify(data), 
        'EX', 
        DRAFT_TTL
      );
    } catch (err) {
      console.error(`[Redis] Save Draft Error:`, err);
    }
  }

  /**
   * Retrieve draft
   */
  static async getDraft(adminId, questionId = 'new') {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return null;

    try {
      const data = await redis.get(keys.adminDraft(adminId, questionId));
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`[Redis] Get Draft Error:`, err);
      return null;
    }
  }

  /**
   * Delete draft (e.g. after successful publish)
   */
  static async clearDraft(adminId, questionId = 'new') {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return;

    try {
      await redis.del(keys.adminDraft(adminId, questionId));
    } catch (err) {
      console.error(`[Redis] Clear Draft Error:`, err);
    }
  }
}

module.exports = DraftService;
