import { Application } from 'express';
import authRoutes from './auth.routes';
import carRoutes from './car.routes';
import garageRoutes from './garage.routes';
import userRoutes from './user.routes';

export default class Routes {
  constructor(app: Application) {
    app.use('/api/auth', authRoutes);
    app.use('/api/cars', carRoutes);
    app.use('/api/garages', garageRoutes);
    app.use('/api/users', userRoutes);
  }
}
