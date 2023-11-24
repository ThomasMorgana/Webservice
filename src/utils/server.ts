import express, { Application } from 'express';
import { rateLimit } from 'express-rate-limit';
import { logRequest } from './logger';
import Routes from '../routes';
import swaggerUi from 'swagger-ui-express';
import { LimiterConfig, swaggerSpec } from '../config';

export default class Server {
  constructor(app: Application) {
    this.configureExpress(app);
    this.configureSwagger(app);
    this.setupMiddleware(app);
    this.initializeRoutes(app);
  }

  private configureExpress(app: Application): void {
    app.use('/api/subscription/stripe-hook', express.raw({ type: '*/*' }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.enable('trust proxy');
  }

  private configureSwagger(app: Application): void {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private setupMiddleware(app: Application): void {
    app.use(rateLimit(LimiterConfig));
    app.use(logRequest);
  }

  private initializeRoutes(app: Application): void {
    new Routes(app);
  }
}
