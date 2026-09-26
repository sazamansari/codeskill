import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheService } from './cache.service';
import { OtpService } from './otp.service';
import { EmailModule } from '../emails/email.module';

@Global()
@Module({
  imports: [EmailModule],
  providers: [RedisService, CacheService, OtpService],
  exports: [RedisService, CacheService, OtpService],
})
export class RedisModule {}
