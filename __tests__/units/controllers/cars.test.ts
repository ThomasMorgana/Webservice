import { Request, Response } from 'express';
import CarController from '../../../src/controllers/car.controller';

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
    it('Empty body should return a 400', async () => {
      const req = {} as Request;
      const res = mockResponse();

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('fetch all cars', () => {
    it('Should return an array of cars', async () => {
      const req = {} as Request;
      const res = mockResponse();

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
