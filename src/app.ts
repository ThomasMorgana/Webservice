import express, { Application } from 'express';
import Server from './utils/server';
import { logger } from './utils/logger';

const app: Application = express();
new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8082;

app
  .listen(PORT, function () {
    logger.info(`Server is running on port ${PORT}.`);
  })
  .on('error', () => {
    logger.info('The server could not start');
  });
