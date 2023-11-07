import pino from 'pino';
import expressPino from 'express-pino-logger';

export const logger = pino({
  name: 'webservice',
  level: 'debug',
  // TODO: may cause a problem on prod env because pino-pretty is a dev dependency. Will probably need to be linked to the env.
  transport: {
    target: 'pino-pretty',
  },
});

export const logRequest = expressPino({
  level: 'info',
  // TODO: Set to "true" in production
  autoLogging: false,
  // TODO: may cause a problem on prod env because pino-pretty is a dev dependency. Will probably need to be linked to the env.
  transport: {
    target: 'pino-pretty',
  },
});
