import { PrismaClient, Garage } from '@prisma/client'
import Pagination from '../interfaces/pagination.interface';

const prisma = new PrismaClient()

interface IGarageRepository {
    save(garage: Garage): Promise<Garage>;
    retrieveAll(pagination?: Pagination): Promise<Garage[]>;
    retrieveById(garageId: number): Promise<Garage | null>;
    update(garage: Garage): Promise<Garage>;
    delete(garageId: number): Promise<number>;
}

class GarageRepository implements IGarageRepository {
    
    async save(garage: Garage): Promise<Garage> {
        return await prisma.garage.create({data: { 
            ...garage
        }})
    }

    async retrieveAll(pagination?: Pagination): Promise<Garage[]> {
        if(pagination?.page) {
            const page = pagination.page ?? 0
            const step = pagination.step ?? 10
            return await prisma.garage.findMany({take: +step, skip: +step * +page, orderBy: {id: "asc"}} );
        } else {
            return await prisma.garage.findMany();
        }
    }

    async retrieveById(id: number): Promise<Garage | null> {
        return await prisma.garage.findUnique({where: {id: id}})
    }

    async update(garage: Garage): Promise<Garage> {
        return await prisma.garage.update({
            where: { id: garage.id },
            data: { ...garage },
        });
    }

    async delete(id: number): Promise<number> {
        return (await prisma.garage.delete({where: {id: id}, select: {id: true}})).id
    } 
}

export default new GarageRepository();