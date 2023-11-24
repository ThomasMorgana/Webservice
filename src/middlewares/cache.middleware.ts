import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { createClient } from 'redis';
import { StatusCodes } from 'http-status-codes';

const initialTTL = 3600;

const setCacheHeaders = (res: Response, keyTTL: number, keyCreationTime?: string) => {
  const headers = {
    'X-Cache-Hit': 'true',
    'Cache-Control': `public, max-age=${initialTTL}`,
    'Expires-In': keyTTL,
    'Content-Type': 'application/json',
    Expires: new Date(Date.now() + keyTTL * 1000).toUTCString(),
    'Last-Modified': keyCreationTime ?? 'unknown',
  };

  res.set(headers);
};

export const enableCache = async (req: Request, res: Response, next: NextFunction) => {
  const client = createClient({
    url: process.env.REDIS_URL as string,
  });

  client.on('error', (err) => {
    logger.error(`Redis Client Error: \n ${err}`);
  });

  await client.connect();

  const key = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  try {
    const [cachedResponse, keyTTL, keyCreationTime] = await Promise.all([
      client.get(key),
      client.ttl(key),
      client.get(`${key}:createdAt`),
    ]);

    if (cachedResponse) {
      setCacheHeaders(res, keyTTL, keyCreationTime ?? undefined);
      res.send(cachedResponse);
    } else {
      const originalSend = res.send;

      (res.send as unknown) = async function (this: Response, body: unknown) {
        if (res.statusCode === StatusCodes.OK) {
          await Promise.all([
            client.set(key, JSON.stringify(body), { EX: initialTTL, NX: true }),
            client.set(`${key}:createdAt`, new Date().toUTCString(), { EX: initialTTL, NX: true }),
          ]);
        }
        originalSend.call(this, body);
      };

      next();
    }
  } catch (error) {
    logger.error('Error accessing Redis', error);
    next();
  } finally {
    client.quit();
  }
};
