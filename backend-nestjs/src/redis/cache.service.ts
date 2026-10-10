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
    let keysToDelete: string[] = [];

    if ((client as any).isCluster) {
      const nodes = (client as any).nodes('master');
      for (const node of nodes) {
        const keys = await node.keys(`${prefix}*`);
        keysToDelete.push(...keys);
      }
    } else {
      const keys = await client.keys(`${prefix}*`);
      keysToDelete.push(...keys);
    }

    if (keysToDelete.length > 0) {
      await this.redisService.del(keysToDelete);
    }
  }
}
