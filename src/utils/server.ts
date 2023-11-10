import express, { Application } from 'express';
import { rateLimit } from 'express-rate-limit';
import { logRequest } from './logger';
import Routes from '../routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

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
  }

  private configureSwagger(app: Application): void {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Webservice',
          version: '1.0.0',
          description: 'A framework API',
        },
        host: `localhost:${process.env.PORT}`,
        servers: [
          {
            url: `http://localhost:${process.env.PORT}/api`,
            description: 'local server',
          },
        ],
      },
      apis: ['./src/routes/*.ts'],
    };
    const swaggerSpec = swaggerJSDoc(options);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private setupMiddleware(app: Application): void {
    const limiter = rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 10,
      message: 'Too many requests, please try again later.',
    });

    app.use(limiter);
    app.use(logRequest);
  }

  private initializeRoutes(app: Application): void {
    new Routes(app);
  }
}
