import { Router } from 'express';
import CarController from '../controllers/car.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

class CarRoutes {
  router = Router();
  controller = new CarController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post('/', authenticateToken, this.controller.create);

    this.router.get('/', this.controller.findAll);

    this.router.get('/:id', this.controller.findOne);

    this.router.patch('/:id', authenticateToken, this.controller.update);

    this.router.delete('/:id', authenticateToken, this.controller.delete);
  }
}

export default new CarRoutes().router;
