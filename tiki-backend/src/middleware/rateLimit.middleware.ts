import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { MESSAGES } from '~/libs/constants/messages.constant';
import { response } from '~/libs/utils/response.util';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});
redisClient.connect().catch(console.error);

const rateLimitExceededHandler = (req: Request, res: Response, next: NextFunction) => {
  console.log('Rate limited IP:', req.ip);
  response.manyRequest(res, MESSAGES.RATE_LIMIT_EXCEEDED);
};

export const loginRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts
  handler: rateLimitExceededHandler, // Use handler instead of message
});

export const forgotPasswordRateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  windowMs: 5 * 60 * 1000, // 5 hour
  max: 3, // Limit each IP to 3 forgot password requests
  handler: rateLimitExceededHandler, // Use handler instead of message
});
