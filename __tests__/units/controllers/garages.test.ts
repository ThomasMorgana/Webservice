import { StatusCodes } from 'http-status-codes';
import { GarageService } from '../../../src/services/garage.service';
import { Request, Response } from 'express';
import GarageController from '../../../src/controllers/garage.controller';
import { EntityNotFoundError, InternalServerError } from '../../../src/errors/base.error';

describe('GarageController', () => {
  const BASE_PATH = '/garages';

  const createMockedGarage = () => ({
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Test Garage',
    spaces: 5,
    userId: 'user123',
  });

  class mockedGarageService extends GarageService {
    save = jest.fn();
    update = jest.fn();
    delete = jest.fn();
    retrieveById = jest.fn();
    retrieveAll = jest.fn();
  }

  const mockResponse: Response = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as unknown as Response;

  const entityNotFoundError = new EntityNotFoundError('Garage', createMockedGarage().id.toString());
  const internalServerError = new InternalServerError(new Error('Some Error'), 'Random Test Error');
  const garageService = new mockedGarageService();
  const garageController = new GarageController(garageService);

  describe(`POST ${BASE_PATH}`, () => {
    const mockedGarage = createMockedGarage();

    it('should create a new garage', async () => {
      (garageService.save as jest.MockedFunction<typeof garageService.save>).mockResolvedValueOnce(mockedGarage);

      const mockRequest = {
        body: {
          name: 'Test Garage',
          spaces: 5,
        },
        token: {
          id: 'XXXXXXXX',
        },
      } as unknown as Request;

      await garageController.create(mockRequest, mockResponse);
      expect(garageService.save).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockResponse.send).toHaveBeenCalledWith(mockedGarage);
    });

    it('should send a Auth Error when called without token', async () => {
      const mockRequest = {
        body: {
          name: 'Test Garage',
          spaces: 5,
        },
      } as unknown as Request;

      await garageController.create(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should send a Bad Request error when body is null', async () => {
      const mockRequest = {
        body: null,
        token: {
          id: 'XXXXXXXX',
        },
      } as unknown as Request;

      await garageController.create(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle random errors during creation', async () => {
      (garageService.save as jest.MockedFunction<typeof garageService.save>).mockRejectedValueOnce(internalServerError);

      const mockRequest = {
        body: {
          name: 'Test Garage',
          spaces: 5,
        },
        token: {
          id: 'XXXXXXXX',
        },
      } as unknown as Request;

      await garageController.create(mockRequest, mockResponse);

      expect(garageService.save).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe(`GET ${BASE_PATH}`, () => {
    it('should retrieve all garages', async () => {
      const mockGarages = [createMockedGarage(), createMockedGarage(), createMockedGarage()];

      (garageService.retrieveAll as jest.MockedFunction<typeof garageService.retrieveAll>).mockResolvedValueOnce(
        mockGarages,
      );

      const mockRequest: Request = {} as Request;

      await garageController.findAll(mockRequest, mockResponse);

      expect(garageService.retrieveAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(mockGarages);
    });

    it('should handle random errors during retrieval', async () => {
      (garageService.retrieveAll as jest.MockedFunction<typeof garageService.retrieveAll>).mockRejectedValueOnce(
        internalServerError,
      );

      const mockRequest: Request = {} as Request;

      try {
        await garageController.findAll(mockRequest, mockResponse);
      } catch (error) {}

      expect(garageService.retrieveAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe(`GET ${BASE_PATH}/:id`, () => {
    it('should retrieve a garage by ID', async () => {
      const mockGarage = createMockedGarage();

      (garageService.retrieveById as jest.MockedFunction<typeof garageService.retrieveById>).mockResolvedValueOnce(
        mockGarage,
      );

      const mockRequest: Request = {
        params: { id: '1' },
      } as unknown as Request;

      await garageController.findOne(mockRequest, mockResponse);

      expect(garageService.retrieveById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.send).toHaveBeenCalledWith(mockGarage);
      expect.assertions(3);
    });

    it('should handle not found garage during retrieval by ID', async () => {
      (garageService.retrieveById as jest.MockedFunction<typeof garageService.retrieveById>).mockImplementation(() => {
        throw entityNotFoundError;
      });

      const mockRequest: Request = {
        params: { id: '1' },
      } as unknown as Request;

      await garageController.findOne(mockRequest, mockResponse);

      expect(garageService.retrieveById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Garage with id=1 not found' });
      expect.assertions(3);
    });

    it('should handle random errors during retrieval by ID', async () => {
      (garageService.retrieveById as jest.MockedFunction<typeof garageService.retrieveById>).mockRejectedValueOnce(
        internalServerError,
      );

      const mockRequest: Request = {
        params: { id: '1' },
      } as unknown as Request;

      try {
        await garageController.findOne(mockRequest, mockResponse);
      } catch (error) {}
      expect(garageService.retrieveById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(mockResponse.send).toHaveBeenCalled();
      expect.assertions(3);
    });
  });

  describe(`PUT ${BASE_PATH}/:id`, () => {
    it('should update a garage by ID', async () => {
      const mockGarage = createMockedGarage();

      const mockRequest: Request = {
        body: {
          name: 'Updated Garage',
          spaces: 10,
        },
        params: { id: '1' },
      } as unknown as Request;

      (garageService.update as jest.MockedFunction<typeof garageService.update>).mockResolvedValueOnce({
        ...mockGarage,
        ...mockRequest.body,
      });

      await garageController.update(mockRequest, mockResponse);

      expect(garageService.update).toHaveBeenCalledWith(mockRequest.body);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.send).toHaveBeenCalledWith({
        ...mockGarage,
        ...mockRequest.body,
      });
    });

    it('should handle not found garage during update by ID', async () => {
      (garageService.update as jest.MockedFunction<typeof garageService.update>).mockImplementation(() => {
        throw entityNotFoundError;
      });

      const mockRequest: Request = {
        body: {
          name: 'Updated Garage',
          spaces: 10,
        },
        params: { id: '1' },
      } as unknown as Request;

      await garageController.update(mockRequest, mockResponse);

      expect(garageService.update).toHaveBeenCalledWith({ id: 1, ...mockRequest.body });
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Garage with id=1 not found' });
    });

    it('should handle errors during update by ID', async () => {
      (garageService.update as jest.MockedFunction<typeof garageService.update>).mockRejectedValueOnce(
        internalServerError,
      );

      const mockRequest: Request = {
        body: {
          name: 'Updated Garage',
          spaces: 10,
        },
        params: { id: '1' },
      } as unknown as Request;

      await garageController.update(mockRequest, mockResponse);

      expect(garageService.update).toHaveBeenCalledWith({ id: 1, ...mockRequest.body });
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe(`DELETE ${BASE_PATH}/:id`, () => {
    it('should delete a garage by ID', async () => {
      const mockRequest: Request = {
        params: { id: '1' },
      } as unknown as Request;

      await garageController.delete(mockRequest, mockResponse);

      expect(garageService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Garage deleted' });
    });

    it('should handle not found garage during delete by ID', async () => {
      (garageService.delete as jest.MockedFunction<typeof garageService.delete>).mockImplementation(() => {
        throw entityNotFoundError;
      });
      const mockRequest: Request = {
        params: { id: '1' },
      } as unknown as Request;

      await garageController.delete(mockRequest, mockResponse);

      expect(garageService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Garage with id=1 not found' });
    });

    it('should handle errors during delete by ID', async () => {
      (garageService.delete as jest.MockedFunction<typeof garageService.delete>).mockRejectedValueOnce(
        internalServerError,
      );

      const mockRequest: Request = {
        params: { id: '1' },
      } as unknown as Request;

      await garageController.delete(mockRequest, mockResponse);

      expect(garageService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});
