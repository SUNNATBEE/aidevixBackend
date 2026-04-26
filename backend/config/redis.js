const Redis = require('ioredis');
const RedisStore = require('rate-limit-redis').default;

let client = null;
let warned = false;

const getRedisClient = () => {
  if (client) return client;
  const url = process.env.REDIS_URL;
  if (!url) return null;

  client = new Redis(url, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false,
    retryStrategy: (times) => Math.min(times * 200, 2000),
  });

  client.on('error', (err) => {
    if (!warned) {
      console.error('⚠️  Redis error:', err.message);
      warned = true;
    }
  });
  client.on('ready', () => {
    console.log('✅ Redis connected — distributed rate limiting active');
    warned = false;
  });

  return client;
};

const makeStore = (prefix) => {
  const redis = getRedisClient();
  if (!redis) return undefined; // express-rate-limit falls back to MemoryStore

  return new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: `rl:${prefix}:`,
  });
};

module.exports = { getRedisClient, makeStore };
