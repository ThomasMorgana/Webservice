import { PrismaClient, Car } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';

const prisma = new PrismaClient();

interface ICarRepository {
  // eslint-disable-next-line no-unused-vars
  save(car: Car): Promise<Car>;
  retrieveAll(pagination?: Pagination): Promise<Car[]>;
  retrieveById(carId: number): Promise<Car | null>;
  update(car: Car): Promise<Car>;
  delete(carId: number): Promise<number>;
}

class CarRepository implements ICarRepository {
  async save(car: Car): Promise<Car> {
    return await prisma.car.create({
      data: {
        model: car.model,
        brand: car.brand,
        year: car.year,
        user: { connect: { id: car.userId } },
      },
    });
  }

  async retrieveAll(pagination?: Pagination): Promise<Car[]> {
    if (pagination?.page) {
      const page = pagination.page ?? 0;
      const step = pagination.step ?? 10;
      return await prisma.car.findMany({ take: +step, skip: +step * +page, orderBy: { id: 'asc' } });
    } else {
      return await prisma.car.findMany();
    }
  }

  async retrieveById(id: number): Promise<Car | null> {
    return await prisma.car.findUnique({ where: { id: id } });
  }

  async update(car: Car): Promise<Car> {
    return await prisma.car.update({
      where: { id: car.id },
      data: { ...car },
    });
  }

  async delete(id: number): Promise<number> {
    return (await prisma.car.delete({ where: { id: id }, select: { id: true } })).id;
  }
}

export default new CarRepository();
