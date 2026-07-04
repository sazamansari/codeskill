const { getRedisClient } = require('../../config/redis');
const keys = require('../utils/keys');

const OTP_TTL = 300; // 5 minutes
const MAX_ATTEMPTS = 3;

class OTPService {
  /**
   * Store OTP
   */
  static async storeOTP(email, otp) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') return false;

    try {
      await redis.set(keys.otpData(email), otp, 'EX', OTP_TTL);
      await redis.set(keys.otpAttempts(email), 0, 'EX', OTP_TTL);
      return true;
    } catch (err) {
      console.error(`[Redis] Store OTP Error:`, err);
      return false;
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(email, inputOtp) {
    const redis = getRedisClient();
    if (!redis || redis.status !== 'ready') throw new Error("Service unavailable");

    try {
      const attemptsKey = keys.otpAttempts(email);
      let attempts = await redis.get(attemptsKey);
      attempts = attempts ? parseInt(attempts) : 0;

      if (attempts >= MAX_ATTEMPTS) {
        return { success: false, message: "Too many failed attempts. Try again later." };
      }

      const storedOtp = await redis.get(keys.otpData(email));
      
      if (!storedOtp) {
        return { success: false, message: "OTP expired or invalid." };
      }

      if (storedOtp === inputOtp) {
        // Success: Clean up
        await redis.del(keys.otpData(email), attemptsKey);
        return { success: true };
      } else {
        // Failed attempt
        await redis.incr(attemptsKey);
        return { success: false, message: "Invalid OTP." };
      }
    } catch (err) {
      console.error(`[Redis] Verify OTP Error:`, err);
      return { success: false, message: "Error verifying OTP." };
    }
  }
}

module.exports = OTPService;
