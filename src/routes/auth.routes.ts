import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

class AuthRoutes {
  private router = Router();
  private controller = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/login', this.controller.login);
    this.router.post('/register', this.controller.register);
    this.router.post('/refresh-token', this.controller.generateRefreshToken);
    this.router.post('/reset-token', this.controller.generateResetToken);
    this.router.post('/reset-password', this.controller.resetPassword);
  }

  getRouter() {
    return this.router;
  }
}

export default new AuthRoutes().getRouter();
