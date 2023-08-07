import { PrismaClient, Garage } from "@prisma/client";
import { faker } from "@faker-js/faker";

export const seedCars = async (prisma: PrismaClient) => {
  console.info("Car seeding started")
  //Clean table
  await prisma.car.deleteMany({})
  
  const garages: Garage[] = await prisma.garage.findMany({});

  const amountOfCars = 50;

  for(let i = 0; i < amountOfCars; i++) {
    const randGarageIndex = Math.floor(Math.random() * garages.length)
    
    await prisma.car.create({
      data: {
        model: faker.vehicle.model(),
        brand: faker.vehicle.manufacturer(),
        year: faker.date.past().getFullYear().toString(),
        garage: { connect: { id : garages[randGarageIndex]?.id}}
      }
    })
  }

  console.info("Car seeding done")
};