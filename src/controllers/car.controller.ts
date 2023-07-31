import { Request, Response } from "express";
import CarRepository from "../repositories/car.repository";
import carRepository from "../repositories/car.repository";
import Car from "../models/car.model";

export default class TutorialController {

  async create(req: Request, res: Response) {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });

        return;
    }
    try {
        const car: Car = req.body
        const savedCar = carRepository.save(req.body)
        res.status(201).send(savedCar)
    } catch (err) {
      res.status(500).send({
        message: "Internal Server Error!"
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
        const cars = carRepository.retrieveAll()
        res.status(200).send(cars)
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error!"
        });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    try {
        const car = carRepository.retrieveById(id)
        res.status(200).send(car)
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error!"
        });
    }
  }

  async update(req: Request, res: Response) {
    let carToUpdate: Car = req.body;
    carToUpdate.id = parseInt(req.params.id);
    try {
        const car = carRepository.update(carToUpdate)
        res.status(200).send(car)
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error!"
        });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    try {
      const bool = carRepository.delete(id)
      res.status(bool ? 200 : 404).send({
        message: bool ? "Car deleted" : `Car with id=${id} not found`
      });
    } catch (err) {
      res.status(500).send({
        message: "Internal Server Error!"
      });
    }
  }
}
