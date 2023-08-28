import { Router } from "express";
import UserController from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

class UserRoutes {
  router = Router();
  controller = new UserController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/", this.controller.findAll);

    this.router.get("/:id", this.controller.findOne);

    this.router.patch("/:id",  authenticateToken, this.controller.update);

    this.router.delete("/:id",  authenticateToken, this.controller.delete);
  }
}

export default new UserRoutes().router;
