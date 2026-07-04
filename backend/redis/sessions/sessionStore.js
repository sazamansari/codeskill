const { getRedisClient } = require('../../config/redis');
const keys = require('../utils/keys');

class SessionStore {
  /**
   * Track active session for user
   */
  static async addSession(userId, tokenData, ttlSeconds) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return;

    try {
      // Use sorted set with timestamp to track multiple devices? Or just hash.
      // Keeping it simple: Hash with tokenSignature as key.
      await redis.hset(keys.sessionUser(userId), tokenData.signature, JSON.stringify(tokenData));
      await redis.expire(keys.sessionUser(userId), ttlSeconds);
    } catch (err) {
      console.error(`[Redis] Add Session Error:`, err);
    }
  }

  /**
   * Blacklist a token (logout)
   */
  static async revokeToken(tokenSignature, ttlSeconds) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return;

    try {
      // Store in revoked list until it naturally expires
      await redis.set(keys.revokedToken(tokenSignature), 'revoked', 'EX', ttlSeconds);
    } catch (err) {
      console.error(`[Redis] Revoke Token Error:`, err);
    }
  }

  /**
   * Check if token is revoked
   */
  static async isTokenRevoked(tokenSignature) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return false; // Allow if Redis is down

    try {
      const isRevoked = await redis.exists(keys.revokedToken(tokenSignature));
      return isRevoked === 1;
    } catch (err) {
      console.error(`[Redis] Check Revoked Token Error:`, err);
      return false;
    }
  }
}

module.exports = SessionStore;
