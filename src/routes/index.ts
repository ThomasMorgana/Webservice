import { Application, Router } from 'express';
import AuthRoutes from './auth.routes';
import CarRoutes from './car.routes';
import GarageRoutes from './garage.routes';
import UserRoutes from './user.routes';
import MonitoringRoutes from './monitoring.routes';
import SubscriptionRoutes from './subscription.routes';

export default class Routes {
  constructor(app: Application) {
    this.registerRoutes(app);
  }

  private registerRoutes(app: Application) {
    const apiRouter = Router();

    /**
     * @swagger
     * tags:
     *   name: Authentication
     *   description: Account management
     */
    apiRouter.use('/auth', AuthRoutes);

    /**
     * @swagger
     * tags:
     *   name: Users
     *   description: User management
     */
    apiRouter.use('/users', UserRoutes);

    /**
     * @swagger
     * tags:
     *   name: Subscriptions
     *   description: Subscription management
     */
    apiRouter.use('/subscriptions', SubscriptionRoutes);

    /**
     * @swagger
     * tags:
     *   name: Cars
     *   description: Cars management
     */
    apiRouter.use('/cars', CarRoutes);

    /**
     * @swagger
     * tags:
     *   name: Garages
     *   description: Garage management
     */
    apiRouter.use('/garages', GarageRoutes);

    app.use('/api', apiRouter);

    app.use('/', MonitoringRoutes);
  }
}
