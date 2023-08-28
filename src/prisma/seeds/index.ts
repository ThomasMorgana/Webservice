import { seedGarages } from "./garages.seeds";
import { seedCars } from "./car.seeds";
import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./user.seeds";

const prisma = new PrismaClient();

const seed = async () => {
  await seedUsers(prisma)
  await seedGarages(prisma)
  await seedCars(prisma)
};

seed().then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})