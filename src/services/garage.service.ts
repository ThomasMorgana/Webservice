import { PrismaClient, Garage, Prisma } from '@prisma/client';
import Pagination from '../interfaces/pagination.interface';
import { EntityNotFoundError, InternalServerError } from '../errors/base.error';
import { GarageDTO, GarageUpdateDTO } from '../utils/validator_schemas';

export class GarageService {
  private repository: PrismaClient = new PrismaClient();

  async save(userId: string, garage: GarageDTO): Promise<Garage> {
    try {
      return this.repository.garage.create({
        data: { ...garage, userId },
      });
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  async retrieveAll(pagination?: Pagination): Promise<Garage[]> {
    const { page = 0, step = 10 } = pagination || {};
    try {
      const garages = await this.repository.garage.findMany({
        take: +step,
        skip: +step * +page,
        orderBy: { id: 'asc' },
      });
      return garages;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  async retrieveById(id: number): Promise<Garage> {
    try {
      const garage = await this.repository.garage.findUnique({ where: { id } });
      if (!garage) throw new EntityNotFoundError('Garage', id.toString());
      return garage;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('Garage', id.toString());
      } else {
        throw new InternalServerError(error);
      }
    }
  }

  async update(id: number, garage: GarageUpdateDTO): Promise<Garage> {
    try {
      return this.repository.garage.update({
        where: { id },
        data: { ...garage },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new EntityNotFoundError('Garage', id.toString());
      } else {
        throw new InternalServerError(error);
      }
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const result = await this.repository.garage.delete({
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
