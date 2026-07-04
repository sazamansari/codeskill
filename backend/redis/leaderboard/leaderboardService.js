const { getRedisClient } = require('../../config/redis');
const keys = require('../utils/keys');

class LeaderboardService {
  /**
   * Adds or updates a user's score in a leaderboard (Sorted Set).
   * Used for global, contest, company, etc.
   */
  static async addScore(leaderboardKey, userId, score) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return;

    try {
      // ZINCRBY increments the score. ZADD would overwrite it.
      await redis.zincrby(leaderboardKey, score, userId);
    } catch (err) {
      console.error(`[Redis] Leaderboard AddScore Error:`, err);
    }
  }

  /**
   * Get the top N users from a leaderboard.
   */
  static async getTop(leaderboardKey, limit = 100) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return [];

    try {
      // ZREVRANGE with WITHSCORES returns descending order
      const result = await redis.zrevrange(leaderboardKey, 0, limit - 1, 'WITHSCORES');
      
      // Parse array like [user1, score1, user2, score2] into objects
      const leaderboard = [];
      for (let i = 0; i < result.length; i += 2) {
        leaderboard.push({
          userId: result[i],
          score: parseInt(result[i + 1])
        });
      }
      return leaderboard;
    } catch (err) {
      console.error(`[Redis] Leaderboard GetTop Error:`, err);
      return [];
    }
  }

  /**
   * Get a specific user's rank (0-indexed).
   */
  static async getUserRank(leaderboardKey, userId) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return null;

    try {
      // ZREVRANK gets rank descending
      const rank = await redis.zrevrank(leaderboardKey, userId);
      return rank !== null ? rank + 1 : null; // Return 1-indexed rank
    } catch (err) {
      console.error(`[Redis] Leaderboard GetUserRank Error:`, err);
      return null;
    }
  }
}

module.exports = LeaderboardService;
