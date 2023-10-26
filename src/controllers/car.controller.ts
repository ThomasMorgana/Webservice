import { Request, Response } from 'express';
import carService from '../services/car.services';
import { Prisma, Car } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { AuthenticatedRequest } from '../interfaces/auth.interface';

export default class CarController {
  async create(req: Request, res: Response) {
    if (!req.body) {
      res.status(400).send({
        message: 'Content can not be empty!',
      });

      return;
    }
    try {
      const car: Car = req.body;
      car.userId = (req as AuthenticatedRequest).token.id;
      const savedCar = await carService.save(car);
      res.status(201).send(savedCar);
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error! Something went wrong while creating the car',
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const cars = await carService.retrieveAll(req.query as Pagination);
      res.status(200).send(cars);
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error! Something went wrong getting the cars',
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    try {
      const car = await carService.retrieveById(id);
      res.status(car ? 200 : 400).send(car ? car : `Car with id=${id} not found`);
    } catch (error) {
      res.status(500).send({
        message: 'Internal Server Error!',
      });
    }
  }

  async update(req: Request, res: Response) {
    const carToUpdate: Car = req.body;
    carToUpdate.id = parseInt(req.params.id);
    try {
      const car = await carService.update(carToUpdate);
      res.status(200).send(car);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).send({
          message: `Car with id=${carToUpdate.id} not found`,
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error!',
        });
      }
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    try {
      await carService.delete(id);
      res.status(200).send({
        message: `Car with id=${id} deleted`,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        res.status(404).send({
          message: `Car with id=${id} not found`,
        });
      } else {
        res.status(500).send({
          message: 'Internal Server Error!',
        });
      }
    }
  }
}
