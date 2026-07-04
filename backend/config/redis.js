const Redis = require('ioredis');

// Shared Redis options
const getRedisOptions = () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    if (times % 10 === 0 || times === 1) {
      console.warn(`[Redis] Retrying connection in ${delay}ms... (Attempt ${times})`);
    }
    return delay;
  },
  maxRetriesPerRequest: 50, // Essential for BullMQ
});

// Singleton Redis Client
let redisClient = null;

const getRedisClient = () => {
  if (!redisClient) {
    console.log('[Redis] Initializing primary connection...');
    const url = process.env.REDIS_URL;
    
    if (url) {
      redisClient = new Redis(url, getRedisOptions());
    } else {
      redisClient = new Redis(getRedisOptions());
    }

    redisClient.on('connect', () => {
      console.log('[Redis] Successfully connected');
    });

    redisClient.on('error', (err) => {
      if (err.code !== 'ECONNREFUSED') {
        console.error('[Redis] Connection Error:', err.message);
      }
    });

    redisClient.on('ready', () => {
      console.log('[Redis] Client is ready to accept commands');
    });
  }

  return redisClient;
};

// Graceful shutdown
const closeRedis = async () => {
  if (redisClient) {
    console.log('[Redis] Closing connection...');
    await redisClient.quit();
    redisClient = null;
  }
};

module.exports = {
  getRedisClient,
  closeRedis,
  getRedisOptions // Needed for BullMQ to create its own connections
};
