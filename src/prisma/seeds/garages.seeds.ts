import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export const seedGarages = async (prisma: PrismaClient) => {
  console.info("Garage seeding started")

  //Clean table
  await prisma.garage.deleteMany({})

  const amountOfGarages = 10;

  for(let i = 0; i < amountOfGarages; i++) {
    await prisma.garage.create({
      data: {
        name: faker.location.city(),
        spaces: Math.floor(Math.random() * 10),
      }
    })
  }

  console.info("Garage seeding done")

};