import { Request, Response } from 'express';
import carService from '../services/car.service';
import { Car } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { AuthenticatedRequest } from '../interfaces/auth.interface';
import { errorHandler } from '../utils/error_handler';
import { StatusCodes } from 'http-status-codes';

export default class CarController {
  async create(req: Request, res: Response) {
    if (!req.body) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Content can not be empty!',
      });
    }

    const car: Car = req.body;
    car.userId = (req as AuthenticatedRequest).token.id;

    try {
      const savedCar = await carService.save(car);
      res.status(StatusCodes.CREATED).send(savedCar);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const cars = await carService.retrieveAll(req.query as Pagination);
      res.status(StatusCodes.OK).send(cars);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const car = await carService.retrieveById(id);
      if (car) {
        res.status(StatusCodes.OK).send(car);
      } else {
        res.status(StatusCodes.NOT_FOUND).send(`Car with id=${id} not found`);
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
      res.status(StatusCodes.OK).send(car);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      await carService.delete(id);
      res.status(StatusCodes.OK).send({
        message: `Car with id=${id} deleted`,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }
}
