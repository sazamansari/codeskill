import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('redis.url');
    const options: any = {
      host: this.configService.get<string>('redis.host') || '127.0.0.1',
      port: this.configService.get<number>('redis.port') || 6379,
      password: this.configService.get<string>('redis.password'),
      enableOfflineQueue: false,
      connectTimeout: 2000,
      commandTimeout: 1000,
      maxRetriesPerRequest: 1,
      retryStrategy(times: number) {
        if (times > 3) return null;
        const delay = Math.min(times * 100, 1000);
        return delay;
      },
    };

    if (url) {
      this.client = new Redis(url, options);
    } else {
      this.client = new Redis(options);
    }

    this.client.on('connect', () =>
      this.logger.log('Redis successfully connected'),
    );
    this.client.on('error', (err: any) => {
      if (err.code !== 'ECONNREFUSED') {
        this.logger.warn(`Redis notice: ${err.message}`);
      }
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const stringValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      if (ttlSeconds) {
        await Promise.race([
          this.client.set(key, stringValue, 'EX', ttlSeconds),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 500),
          ),
        ]);
      } else {
        await Promise.race([
          this.client.set(key, stringValue),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 500),
          ),
        ]);
      }
    } catch {
      // Non-blocking fallback
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await Promise.race([
        this.client.get(key),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 500),
        ),
      ]);
      if (!value) return null;
      try {
        return JSON.parse(value as string) as T;
      } catch {
        return value as unknown as T;
      }
    } catch {
      return null;
    }
  }

  async del(key: string | string[]): Promise<void> {
    try {
      const keys = Array.isArray(key) ? key : [key];
      if (keys.length > 0) {
        await Promise.race([
          this.client.del(...keys),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 500),
          ),
        ]);
      }
    } catch {
      // Non-blocking fallback
    }
  }

  async onModuleDestroy() {
    try {
      this.logger.log('Closing Redis connection...');
      await this.client.quit();
    } catch {
      // Ignore on destroy
    }
  }
}

