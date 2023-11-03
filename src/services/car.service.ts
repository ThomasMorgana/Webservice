import { PrismaClient, Car } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';

const prisma = new PrismaClient();

export class CarRepository {
  constructor(private prisma: PrismaClient) {}

  async save(car: Car): Promise<Car> {
    return this.prisma.car.create({
      data: {
        model: car.model,
        brand: car.brand,
        year: car.year,
        user: { connect: { id: car.userId } },
      },
    });
  }

  async retrieveAll(pagination?: Pagination): Promise<Car[]> {
    const { page = 0, step = 10 } = pagination || {};
    const cars = await this.prisma.car.findMany({
      take: +step,
      skip: +step * +page,
      orderBy: { id: 'asc' },
    });
    return cars;
  }

  async retrieveById(id: number): Promise<Car | null> {
    return this.prisma.car.findUnique({ where: { id } });
  }

  async update(car: Car): Promise<Car> {
    return this.prisma.car.update({
      where: { id: car.id },
      data: { ...car },
    });
  }

  async delete(id: number): Promise<number> {
    const result = await this.prisma.car.delete({ where: { id }, select: { id: true } });
    return result.id;
  }
}

export default new CarRepository(prisma);
