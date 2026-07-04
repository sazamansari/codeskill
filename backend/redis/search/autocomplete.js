const { getRedisClient } = require('../../config/redis');
const keys = require('../utils/keys');

class AutocompleteService {
  /**
   * Adds an item to the autocomplete index (Sorted Set).
   * E.g., 'Two Sum' -> insert all prefixes ('t', 'tw', 'two'...).
   */
  static async addItem(type, text) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return;

    try {
      const normalized = text.toLowerCase().trim();
      const pipeline = redis.pipeline();
      
      // Store all prefixes of the word
      for (let i = 1; i <= normalized.length; i++) {
        const prefix = normalized.substring(0, i);
        pipeline.zadd(keys.searchAutocomplete(`${type}:${prefix}`), 0, text);
      }
      
      await pipeline.exec();
    } catch (err) {
      console.error(`[Redis] Autocomplete Add Error:`, err);
    }
  }

  /**
   * Fast prefix search.
   */
  static async search(type, prefix, limit = 10) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return [];

    try {
      const normalized = prefix.toLowerCase().trim();
      // Using ZRANGE to fetch matches
      const results = await redis.zrange(keys.searchAutocomplete(`${type}:${normalized}`), 0, limit - 1);
      return results;
    } catch (err) {
      console.error(`[Redis] Autocomplete Search Error:`, err);
      return [];
    }
  }
}

module.exports = AutocompleteService;
