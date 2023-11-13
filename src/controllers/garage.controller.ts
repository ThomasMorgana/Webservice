import { Request, Response } from 'express';
import { Garage } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { errorHandler } from '../utils/error_handler';
import { StatusCodes } from 'http-status-codes';
import { GarageService } from '../services/garage.service';

export default class GarageController {
  private garageService: GarageService;

  constructor(service: GarageService) {
    this.garageService = service;
  }

  create = async (req: Request, res: Response) => {
    if (!req.body)
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Content can not be empty!',
      });

    if (!req.token || !req.token.id)
      return res.status(StatusCodes.UNAUTHORIZED).send({
        message: 'Authentication error : token not readable',
      });

    try {
      const garage: Garage = req.body;
      garage.userId = req.token.id;
      const savedGarage = await this.garageService.save(garage);

      res.status(StatusCodes.CREATED).send(savedGarage);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  findAll = async (req: Request, res: Response) => {
    try {
      const garages = await this.garageService.retrieveAll(req.query as Pagination);
      res.status(StatusCodes.OK).send(garages);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  findOne = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);

    try {
      const garage = await this.garageService.retrieveById(id);
      res.status(StatusCodes.OK).send(garage);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  update = async (req: Request, res: Response) => {
    const garageToUpdate: Garage = req.body;
    garageToUpdate.id = parseInt(req.params.id);

    try {
      const garage = await this.garageService.update(garageToUpdate);
      res.status(StatusCodes.OK).send(garage);
    } catch (error) {
      errorHandler(res, error);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      await this.garageService.delete(id);
      res.status(StatusCodes.OK).send({
        message: `Garage deleted`,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  };
}
