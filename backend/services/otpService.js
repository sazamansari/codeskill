const { getRedisClient } = require("../config/redis");
const crypto = require("crypto");
const { sendOTPEmail } = require("./emailService");

// Generate a random 6-digit numeric OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const sendOTP = async (email) => {
  if (!email || typeof email !== "string") {
    throw new Error("A valid email address is required to send OTP.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const redisClient = getRedisClient();
  if (redisClient.status !== 'ready') {
    throw new Error("Redis is not connected. Cannot send OTP.");
  }

  // Rate limiting (optional check) to prevent spamming
  const rateLimitKey = `otp_ratelimit:${normalizedEmail}`;
  const isRateLimited = await redisClient.get(rateLimitKey);
  if (isRateLimited) {
    throw new Error("Please wait before requesting another OTP.");
  }

  const otp = generateOTP();
  const otpKey = `otp:${normalizedEmail}`;

  // Store OTP in Redis for 5 minutes (300 seconds)
  await redisClient.set(otpKey, otp, "EX", 300);
  
  // Set rate limit for 60 seconds
  await redisClient.set(rateLimitKey, "1", "EX", 60);

  // Send the email via AWS SES
  try {
    await sendOTPEmail(normalizedEmail, otp);
  } catch (emailError) {
    // If email send fails, clean up the OTP and rate limit from Redis
    // so the user can retry immediately
    console.error(`[OTP] Email send failed for ${normalizedEmail}, cleaning up Redis keys`);
    await redisClient.del(otpKey).catch(() => {});
    await redisClient.del(rateLimitKey).catch(() => {});
    throw emailError;
  }

  return { success: true, message: "OTP sent successfully" };
};

const verifyOTP = async (email, code) => {
  if (!email || !code) {
    throw new Error("Email and OTP code are required.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const redisClient = getRedisClient();
  if (redisClient.status !== 'ready') {
    throw new Error("Redis is not connected. Cannot verify OTP.");
  }

  const otpKey = `otp:${normalizedEmail}`;
  const storedOTP = await redisClient.get(otpKey);

  if (!storedOTP) {
    throw new Error("OTP expired or not found. Please request a new one.");
  }

  if (storedOTP !== code.toString().trim()) {
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
