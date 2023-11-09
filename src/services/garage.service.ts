import { PrismaClient, Garage, Prisma } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { EntityNotFoundError, InternalServerError } from '../errors/base.error';

const prisma = new PrismaClient();
export class GarageService {
  constructor(private prisma: PrismaClient) {}

  async save(garage: Garage): Promise<Garage> {
    try {
      return this.prisma.garage.create({
        data: { ...garage },
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  async retrieveAll(pagination?: Pagination): Promise<Garage[]> {
    const { page = 0, step = 10 } = pagination || {};
    try {
      const garages = await this.prisma.garage.findMany({
        take: +step,
        skip: +step * +page,
        orderBy: { id: 'asc' },
      });
      return garages;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  async retrieveById(id: number): Promise<Garage | null> {
    try {
      return this.prisma.garage.findUnique({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('Garage', id.toString());
      } else {
        throw new InternalServerError(error);
      }
    }
  }

  async update(garage: Garage): Promise<Garage> {
    try {
      return this.prisma.garage.update({
        where: { id: garage.id },
        data: { ...garage },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('Garage', garage.id.toString());
      } else {
        throw new InternalServerError(error);
      }
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const result = await this.prisma.garage.delete({
        where: { id },
        select: { id: true },
      });
      return result.id;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('Garage', id.toString());
      } else {
        throw new InternalServerError(error);
      }
    }
  }
}

export default new GarageService(prisma);
