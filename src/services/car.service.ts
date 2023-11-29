import { PrismaClient, Car, Prisma } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { EntityNotFoundError, InternalServerError } from '../errors/base.error';
import { CarDTO, CarUptadeDTO } from '../utils/validator_schemas';

export default class CarService {
  private repository: PrismaClient = new PrismaClient();

  async save(userId: string, car: CarDTO): Promise<Car> {
    try {
      const garageConnection = car.garageId ? { connect: { id: car.garageId } } : undefined;
      return this.repository.car.create({
        data: {
          model: car.model,
          brand: car.brand,
          year: car.year,
          garage: garageConnection,
          user: { connect: { id: userId } },
        },
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  async retrieveAll(pagination?: Pagination): Promise<Car[]> {
    const { page = 0, step = 10 } = pagination || {};
    try {
      const cars = await this.repository.car.findMany({
        take: +step,
        skip: +step * +page,
        orderBy: { id: 'asc' },
      });
      return cars;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  async retrieveById(id: number): Promise<Car | null> {
    try {
      return this.repository.car.findUnique({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('Car', id.toString());
      } else {
        throw new InternalServerError(error);
      }
    }
  }

  async update(id: number, car: CarUptadeDTO): Promise<Car> {
    try {
      return this.repository.car.update({
        where: { id },
        data: { ...car },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('Car', id.toString());
      } else {
        throw new InternalServerError(error);
      }
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const result = await this.repository.car.delete({ where: { id }, select: { id: true } });
      return result.id;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('Car', id.toString());
      } else {
        throw new InternalServerError(error);
      }
    }
  }
}
