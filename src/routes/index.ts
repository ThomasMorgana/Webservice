import { Application } from "express";
import homeRoutes from "./home.routes";
import carRoutes from "./car.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", homeRoutes);
    app.use("/api/cars", carRoutes);
  }
}
