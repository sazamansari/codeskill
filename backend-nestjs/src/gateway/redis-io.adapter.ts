import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { INestApplicationContext } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(configService: ConfigService): Promise<void> {
    const url = configService.get<string>('redis.url');
    const options: any = {
      host: configService.get<string>('redis.host') || '127.0.0.1',
      port: configService.get<number>('redis.port') || 6379,
      password: configService.get<string>('redis.password'),
    };
    
    let pubClient: Redis;
    let subClient: Redis;

    if (url) {
      pubClient = new Redis(url, options);
      subClient = new Redis(url, options);
    } else {
      pubClient = new Redis(options);
      subClient = new Redis(options);
    }

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
