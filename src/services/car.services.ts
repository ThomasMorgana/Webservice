import { Car } from "../models/car.model";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ICarRepository {
    save(car: Car): Promise<Car>;
    retrieveAll(): Promise<Car[]>;
    retrieveById(carId: number): Promise<Car | null>;
    update(car: Car): Promise<Car>;
    delete(carId: number): Promise<number>;
}

class CarRepository implements ICarRepository {
    
    async save(car: Car): Promise<Car> {
        return await prisma.car.create({data: { 
            ...car
        }})
    }

    async retrieveAll(): Promise<Car[]> {
        return await prisma.car.findMany();
    }

    async retrieveById(id: number): Promise<Car | null> {
        return await prisma.car.findUnique({where: {id: id}})
    }

    async update(car: Car): Promise<Car> {
        return await prisma.car.update({
            where: { id: car.id },
            data: { ...car },
        });
    }

    async delete(id: number): Promise<number> {
        return (await prisma.car.delete({where: {id: id}, select: {id: true}})).id
    } 
}

export default new CarRepository();