import pino from 'pino';
import pinoHttp from 'pino-http';
import { logRequestConfig, loggerConfig } from '../config';

export const logger = pino(loggerConfig);
export const logRequest = pinoHttp(logRequestConfig);
