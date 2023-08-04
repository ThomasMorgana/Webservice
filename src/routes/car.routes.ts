import { Router } from "express";
import CarController from "../controllers/car.controller";

class CarRoutes {
  router = Router();
  controller = new CarController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post("/", this.controller.create);

    this.router.get("/", this.controller.findAll);

    this.router.get("/:id", this.controller.findOne);

    this.router.patch("/:id", this.controller.update);

    this.router.delete("/:id", this.controller.delete);
  }
}

export default new CarRoutes().router;
