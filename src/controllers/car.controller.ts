import { Request, Response } from "express";
import carRepository from "../repositories/car.repository";
import { Car } from "../models/car.model";
import { Prisma } from "@prisma/client";

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
        const savedCar = await carRepository.save(req.body)
        res.status(201).send(savedCar)
    } catch (error) {
        res.status(500).send({
          message: "Internal Server Error!"
        });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const cars = await carRepository.retrieveAll()
      res.status(200).send(cars)
    } catch (error) {
      res.status(500).send({
        message: "Internal Server Error!"
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    try {
        const car = await carRepository.retrieveById(id)
        res.status(car ? 200 : 400).send(car ? car : `Car with id=${id} not found` )
    } catch (error) {
      res.status(500).send({
        message: "Internal Server Error!"
      });
    }
  }

  async update(req: Request, res: Response) {
    let carToUpdate: Car = req.body;
    carToUpdate.id = parseInt(req.params.id);
    try {
      const car = await carRepository.update(carToUpdate)
      res.status(200).send(car)
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
    ) {
      res.status(404).send({
        message: `Car with id=${carToUpdate.id} not found`
      });
    } else {
      res.status(500).send({
        message: "Internal Server Error!"
      });
    }
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    try {
      await carRepository.delete(id)
      res.status(200).send({
        message: `Car with id=${id} deleted`
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        res.status(404).send({
          message: `Car with id=${id} not found`
        });
      } else {
        res.status(500).send({
          message: "Internal Server Error!"
        });
      }
    }
  }
}
