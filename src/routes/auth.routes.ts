import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

class UserRoutes {
  router = Router();
  controller = new AuthController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post('/login', this.controller.login);

    this.router.post('/register', this.controller.register);

    this.router.post('/refresh-token', this.controller.generateRefreshToken);

    this.router.post('/reset-token', this.controller.generateResetToken);

    this.router.post('/reset-password', this.controller.resetPassword);
  }
}

export default new UserRoutes().router;
