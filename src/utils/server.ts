import express, { Application } from 'express';
import { rateLimit } from 'express-rate-limit';
import { logRequest } from './logger';
import Routes from '../routes';

export default class Server {
  constructor(app: Application) {
    this.configureApp(app);
    this.setupMiddleware(app);
    this.initializeRoutes(app);
  }

  private configureApp(app: Application): void {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
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
