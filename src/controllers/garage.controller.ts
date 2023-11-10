import { Request, Response } from 'express';
import garageService from '../services/garage.service';
import { Garage } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { errorHandler } from '../utils/error_handler';
import { StatusCodes } from 'http-status-codes';

export default class GarageController {
  async create(req: Request, res: Response) {
    if (!req.body)
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Content can not be empty!',
      });

    if (!req.token)
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message: 'Authentication error : token not readable',
      });

    try {
      const garage: Garage = req.body;
      garage.userId = req.token.id;
      const savedGarage = await garageService.save(garage);

      res.status(StatusCodes.CREATED).send(savedGarage);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const garages = await garageService.retrieveAll(req.query as Pagination);
      res.status(StatusCodes.OK).send(garages);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const garage = await garageService.retrieveById(id);
      if (garage) {
        res.status(StatusCodes.OK).send(garage);
      } else {
        res.status(StatusCodes.NOT_FOUND).send(`Garage with id=${id} not found`);
      }
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async update(req: Request, res: Response) {
    const garageToUpdate: Garage = req.body;
    garageToUpdate.id = parseInt(req.params.id);

    try {
      const garage = await garageService.update(garageToUpdate);
      res.status(StatusCodes.OK).send(garage);
    } catch (error) {
      errorHandler(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id: number = parseInt(req.params.id);
      await garageService.delete(id);
      res.status(StatusCodes.OK).send({
        message: `Garage with id=${id} deleted`,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  }
}
