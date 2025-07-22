import { type Request, type Response, Router } from 'express';
import redisClient from '~/configs/redis.config';
import { response } from '~/libs/utils/response.util';

async function clearRateLimit(ip?: string): Promise<void> {
  const pattern = ip ? `fp:${ip}:*` : 'fp:*';
  let cursor = '0';

  do {
    const result = await redisClient.scan(cursor, {
      MATCH: pattern,
      COUNT: 100,
    });

    cursor = result.cursor;
    const keys = result.keys;

    if (keys.length > 0) {
      // 👉 Log từng key
      keys.forEach((key) => console.log('Found key:', key));

      // Xoá key
      for (const key of keys) {
        console.log({ key });
        await redisClient.del(key);
      }
      console.log(`Deleted ${keys.length} keys`);
    }
  } while (cursor !== '0');

  console.log('Done clearing rate limit keys.');
}

const clearRateLimitEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ip } = req.query; // Get IP from query parameter
    if (!ip || typeof ip !== 'string') {
      response.badRequest(res, 'IP address is required');
    }
    await clearRateLimit(ip as string);
    response.success(res, `Rate limit cleared for IP: ${ip}`);
  } catch (error) {
    response.error(res, error, 'Failed to clear rate limit');
  }
};

const getIp = async (req: Request, res: Response): Promise<void> => {
  try {
    const ip = req.ip;
    response.success(res, ip, 'IP address retrieved successfully');
  } catch (error) {
    response.error(res, error, 'Failed to retrieve IP address');
  }
};

const rateLimitRouter = Router();

rateLimitRouter.get('/clear', clearRateLimitEndpoint);
rateLimitRouter.get('/ip', getIp);

export default rateLimitRouter;
