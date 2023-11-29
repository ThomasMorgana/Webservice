import { Request, Response } from 'express';
import CarService from '../services/car.service';
import Pagination from '../interfaces/pagination.interface';
import { errorHandler } from '../utils/error_handler';
import { StatusCodes } from 'http-status-codes';
import { CarDTO, CarSchema, CarUptadeDTO } from '../utils/validator_schemas';

export default class CarController {
  private carService: CarService = new CarService();

  constructor(private service: CarService) {
    this.carService = service;
  }

  create = async (req: Request, res: Response) => {
    if (!req.body)
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Content can not be empty!',
      });

    try {
      const car: CarDTO = CarSchema.parse(req.body);
      const savedCar = await this.carService.save(req.token?.id, car);
      res.status(StatusCodes.CREATED).send(savedCar);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  findAll = async (req: Request, res: Response) => {
    try {
      const cars = await this.carService.retrieveAll(req.query as Pagination);
      res.status(StatusCodes.OK).send(cars);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  findOne = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    if (!id) return res.status(StatusCodes.BAD_REQUEST).send({ message: `ID: ${id} is invalid` });

    try {
      const car = await this.carService.retrieveById(id);
      if (car) {
        res.status(StatusCodes.OK).send(car);
      } else {
        res.status(StatusCodes.NOT_FOUND).send({ message: `Car not found` });
      }
    } catch (error) {
      errorHandler(res, error);
    }
  };

  update = async (req: Request, res: Response) => {
    if (!req.body) return res.status(StatusCodes.BAD_REQUEST).send({ message: `You must provide a body` });

    try {
      const carToUpdate: CarUptadeDTO = CarSchema.parse(req.body);
      const car = await this.carService.update(parseInt(req.params.id), carToUpdate);
      res.status(StatusCodes.OK).send(car);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      await this.carService.delete(id);
      res.status(StatusCodes.OK).send({
        message: `Car deleted`,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  };
}
