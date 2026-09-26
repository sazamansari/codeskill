import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    return this.redisService.get<T>(key);
  }

  async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    await this.redisService.set(key, value, ttlSeconds);
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    const client = this.redisService.getClient();
    const stream = client.scanStream({
      match: `${prefix}*`,
      count: 100,
    });

    return new Promise((resolve, reject) => {
      const keysToDelete: string[] = [];
      stream.on('data', (keys: string[]) => {
        if (keys.length) {
          keysToDelete.push(...keys);
        }
      });
      stream.on('end', async () => {
        if (keysToDelete.length > 0) {
          await this.redisService.del(keysToDelete);
        }
        resolve();
      });
      stream.on('error', (err) => reject(err));
    });
  }
}
