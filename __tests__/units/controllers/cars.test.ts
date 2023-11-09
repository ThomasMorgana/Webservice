import { Request, Response } from 'express';
import CarController from '../../../src/controllers/car.controller';
import { StatusCodes } from 'http-status-codes';

describe('CarController', () => {
  const controller = new CarController();

  const mockResponse = () => {
    const res = {
      send: jest.fn(),
      status: jest.fn(() => res),
    } as unknown as Response;
    return res;
  };

  describe('create car', () => {
    it('Empty body should return a StatusCodes.BAD_REQUEST', async () => {
      const req = {} as Request;
      const res = mockResponse();

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('fetch all cars', () => {
    it('Should return an array of cars', async () => {
      const req = {} as Request;
      const res = mockResponse();

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
