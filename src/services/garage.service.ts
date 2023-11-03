import { PrismaClient, Garage } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';

const prisma = new PrismaClient();
export class GarageRepository {
  constructor(private prisma: PrismaClient) {}

  async save(garage: Garage): Promise<Garage> {
    return this.prisma.garage.create({
      data: { ...garage },
    });
  }

  async retrieveAll(pagination?: Pagination): Promise<Garage[]> {
    const { page = 0, step = 10 } = pagination || {};
    const garages = await this.prisma.garage.findMany({
      take: +step,
      skip: +step * +page,
      orderBy: { id: 'asc' },
    });
    return garages;
  }

  async retrieveById(id: number): Promise<Garage | null> {
    return this.prisma.garage.findUnique({ where: { id } });
  }

  async update(garage: Garage): Promise<Garage> {
    return this.prisma.garage.update({
      where: { id: garage.id },
      data: { ...garage },
    });
  }

  async delete(id: number): Promise<number> {
    const result = await this.prisma.garage.delete({
      where: { id },
      select: { id: true },
    });
    return result.id;
  }
}

export default new GarageRepository(prisma);
