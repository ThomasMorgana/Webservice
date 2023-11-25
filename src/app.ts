import express, { Application } from 'express';
import Server from './utils/server';
import { logger } from './utils/logger';

const app: Application = express();
logger.info('express init');
new Server(app);
logger.info('server init');

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8082;
logger.info(PORT);

app
  .listen(PORT, function () {
    logger.info(`Server is running on port ${PORT}.`);
  })
  .on('error', console.log);
