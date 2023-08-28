import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export const seedUsers = async (prisma: PrismaClient) => {
  console.info("User seeding started")

  await prisma.user.deleteMany({})
  
  const amountOfUsers = 10;

  for(let i = 0; i < amountOfUsers; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: "password",
      }
    })
  }

  console.info("User seeding done")
};