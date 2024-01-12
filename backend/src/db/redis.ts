import { type RedisClientType, createClient } from 'redis';

export const redisClient: RedisClientType = createClient();

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const connectToRedis = async () => {
  await redisClient.connect();
};
