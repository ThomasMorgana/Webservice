import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

class UserRoutes {
  private router = Router();
  private controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/', authenticateToken, this.controller.createAdmin);
    this.router.get('/', this.controller.findAll);
    this.router.get('/:id', this.controller.findOne);
    this.router.patch('/:id', authenticateToken, this.controller.update);
    this.router.delete('/:id', authenticateToken, this.controller.delete);
  }

  getRouter() {
    return this.router;
  }
}

export default new UserRoutes().getRouter();
