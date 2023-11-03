import { Request, Response } from 'express';
import CarController from '../../src/controllers/car.controller';

describe('CarController', () => {
  const controller = new CarController();

  const mockResponse = () => {
    const res = {
      send: jest.fn(),
      status: jest.fn(() => res),
    } as unknown as Response;
    return res;
  };

  describe('getTest', () => {
    it('should return a message', async () => {
      const req = {} as Request;
      const res = mockResponse();

      await controller.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
