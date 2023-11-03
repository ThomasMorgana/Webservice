import { Router } from 'express';
import CarController from '../controllers/car.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

class CarRoutes {
  private router = Router();
  private controller = new CarController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/', authenticateToken, this.controller.create);
    this.router.get('/', this.controller.findAll);
    this.router.get('/:id', this.controller.findOne);
    this.router.patch('/:id', authenticateToken, this.controller.update);
    this.router.delete('/:id', authenticateToken, this.controller.delete);
  }

  getRouter() {
    return this.router;
  }
}

export default new CarRoutes().getRouter();
