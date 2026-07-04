const { getRedisClient } = require("../config/redis");
const crypto = require("crypto");
const { sendOTPEmail } = require("./emailService");

// Generate a random 6-digit numeric OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOTP = async (email) => {
  const redisClient = getRedisClient();
  if (redisClient.status !== 'ready') {
    throw new Error("Redis is not connected");
  }

  // Rate limiting (optional check) to prevent spamming
  const rateLimitKey = `otp_ratelimit:${email}`;
  const isRateLimited = await redisClient.get(rateLimitKey);
  if (isRateLimited) {
    throw new Error("Please wait before requesting another OTP.");
  }

  const otp = generateOTP();
  const otpKey = `otp:${email}`;

  // Store OTP in Redis for 5 minutes (300 seconds)
  await redisClient.set(otpKey, otp, "EX", 300);
  
  // Set rate limit for 60 seconds
  await redisClient.set(rateLimitKey, "1", "EX", 60);

  // Send the email via AWS SES
  await sendOTPEmail(email, otp);

  return { success: true, message: "OTP sent successfully" };
};

const verifyOTP = async (email, code) => {
  const redisClient = getRedisClient();
  if (redisClient.status !== 'ready') {
    throw new Error("Redis is not connected");
  }

  const otpKey = `otp:${email}`;
  const storedOTP = await redisClient.get(otpKey);

  if (!storedOTP) {
    throw new Error("OTP expired or not found. Please request a new one.");
  }

  if (storedOTP !== code) {
    throw new Error("Invalid OTP code.");
  }

  // Clear OTP after successful verification
  await redisClient.del(otpKey);
  
  return true;
};

module.exports = {
  sendOTP,
  verifyOTP,
};
