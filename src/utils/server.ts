import express, { Application } from 'express';
import { logRequest } from './logger';
import Routes from '../routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config';
import { AppContext } from './app_context';

export default class Server {
  constructor(
    readonly app: Application,
    readonly appContext: AppContext,
  ) {}

  start(): void {
    const { logger, port } = this.appContext;

    this.app
      .listen(port, () => {
        logger.info(`Server is running on port ${port}.`);
      })
      .on('error', (error) => logger.error(error));
  }

  static from(app: Application, { port, logger }: AppContext): Server {
    logger.info('express started');
    app.use('/api/subscription/stripe-hook', express.raw({ type: '*/*' }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    logger.info('express initialized');

    logger.info('swagger initializing');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/', (_req, res) => {
      res.redirect('/api-docs');
    });
    logger.info('swagger initialized');

    logger.info('middleware initializing');
    // DISABLED FOR GCP DEPLOYEMNT
    //app.use(rateLimit(LimiterConfig));
    app.use(logRequest);
    logger.info('middleware initialized');

    logger.info('routes initializing');
    new Routes(app);
    logger.info('routes initialized');

    return new Server(app, { logger, port });
  }
}
