import { Router } from 'express';
import GarageController from '../controllers/garage.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

class GarageRoutes {
  private router = Router();
  private controller = new GarageController();

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

export default new GarageRoutes().getRouter();
