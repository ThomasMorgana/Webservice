import { Router } from "express";
import AuthController from "../controllers/auth.controller";

class UserRoutes {
  router = Router();
  controller = new AuthController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post("/login", this.controller.login);

    this.router.post("/register", this.controller.register);

    this.router.post("/refreshToken", this.controller.generateRefreshToken);
  }
}

export default new UserRoutes().router;
