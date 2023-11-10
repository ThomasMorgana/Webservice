import pino from 'pino';
import expressPino from 'express-pino-logger';
import { logRequestConfig, loggerConfig } from '../config';

export const logger = pino(loggerConfig);
export const logRequest = expressPino(logRequestConfig);
