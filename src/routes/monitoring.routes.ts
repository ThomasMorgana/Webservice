import { Request, Response, Router } from 'express';
import promClient from 'prom-client';

class MonitoringRoutes {
  private router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const register = new promClient.Registry();
    register.setDefaultLabels({
      app: 'webservice',
    });
    promClient.collectDefaultMetrics({ register });

    this.router.get('/metrics', async (req: Request, res: Response) => {
      res.setHeader('Content-Type', register.contentType);
      res.send(await register.metrics());
    });
  }

  getRouter() {
    return this.router;
  }
}

export default new MonitoringRoutes().getRouter();
