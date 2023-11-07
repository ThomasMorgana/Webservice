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

    apiRouter.use('/auth', AuthRoutes);
    apiRouter.use('/cars', CarRoutes);
    apiRouter.use('/garages', GarageRoutes);
    apiRouter.use('/users', UserRoutes);
    apiRouter.use('/subscription', SubscriptionRoutes);

    app.use('/api', apiRouter);

    app.use('/', MonitoringRoutes);
  }
}
