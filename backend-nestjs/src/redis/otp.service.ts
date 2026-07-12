import { Injectable, BadRequestException } from '@nestjs/common';
import { RedisService } from './redis.service';
import { EmailService } from '../emails/email.service';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  constructor(
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
  ) {}

  private generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async sendOTP(email: string): Promise<{ success: boolean; message: string }> {
    if (!email || typeof email !== 'string') {
      throw new BadRequestException(
        'A valid email address is required to send OTP.',
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const rateLimitKey = `otp_ratelimit:${normalizedEmail}`;
    const otpKey = `otp:${normalizedEmail}`;

    const isRateLimited = await this.redisService.get(rateLimitKey);
    if (isRateLimited) {
      throw new BadRequestException(
        'Please wait before requesting another OTP.',
      );
    }

    const otp = this.generateOTP();

    // Store OTP for 5 minutes (300 seconds)
    await this.redisService.set(otpKey, otp, 300);
    // Set rate limit for 60 seconds
    await this.redisService.set(rateLimitKey, '1', 60);

    try {
      await this.emailService.sendOTPEmail(normalizedEmail, otp);
    } catch (error) {
      await this.redisService.del([otpKey, rateLimitKey]);
      throw error;
    }

    return { success: true, message: 'OTP sent successfully' };
  }

  async verifyOTP(email: string, code: string): Promise<boolean> {
    if (!email || !code) {
      throw new BadRequestException('Email and OTP code are required.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpKey = `otp:${normalizedEmail}`;

    const storedOTP = await this.redisService.get<string>(otpKey);

    if (!storedOTP) {
      throw new BadRequestException(
        'OTP expired or not found. Please request a new one.',
      );
    }

    if (storedOTP.toString() !== code.toString().trim()) {
      throw new BadRequestException('Invalid OTP code.');
    }

    await this.redisService.del(otpKey);
    return true;
  }
}
