import { Router } from 'express';
import SubscriptionController from '../controllers/subscription.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

class SubscriptionRoutes {
  private router = Router();
  private controller = new SubscriptionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/', this.controller.create);
    this.router.post('/stripe-hook', this.controller.handleStripeHook);
    this.router.get('/', this.controller.findAll);
    this.router.get('/:id', this.controller.findOne);
    this.router.patch('/:id', authenticateToken, this.controller.update);
    this.router.delete('/:id', authenticateToken, this.controller.delete);
  }

  getRouter() {
    return this.router;
  }
}

export default new SubscriptionRoutes().getRouter();
