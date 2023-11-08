import { Request, Response } from 'express';
import carService from '../services/car.service';
import { Car, Prisma } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { AuthenticatedRequest } from '../interfaces/auth.interface';
import { errorHandler } from '../utils/error_handler';

export default class CarController {
  async create(req: Request, res: Response) {
    if (!req.body) {
      return res.status(400).send({
        message: 'Content can not be empty!',
      });
    }

    const car: Car = req.body;
    car.userId = (req as AuthenticatedRequest).token.id;

    try {
      const savedCar = await carService.save(car);
      res.status(201).send(savedCar);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const cars = await carService.retrieveAll(req.query as Pagination);
      res.status(200).send(cars);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const car = await carService.retrieveById(id);
      if (car) {
        res.status(200).send(car);
      } else {
        res.status(404).send(`Car with id=${id} not found`);
      }
    } catch (error) {
      errorHandler(res, error);
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
        errorHandler(res, error);
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
        errorHandler(res, error);
      }
    }
  }
}
