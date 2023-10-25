import { Router } from 'express';
import GarageController from '../controllers/garage.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

class GarageRoutes {
  router = Router();
  controller = new GarageController();

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

export default new GarageRoutes().router;
