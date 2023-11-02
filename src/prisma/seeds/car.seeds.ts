import { PrismaClient, Garage, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { logger } from '../../utils/logger';

export const seedCars = async (prisma: PrismaClient) => {
  logger.info('Car seeding started');

  await prisma.car.deleteMany({});

  const garages: Garage[] = await prisma.garage.findMany({});
  const users: User[] = await prisma.user.findMany({});

  const amountOfCars = 50;

  for (let i = 0; i < amountOfCars; i++) {
    const randGarageIndex = Math.floor(Math.random() * garages.length);
    const randUserIndex = Math.floor(Math.random() * users.length);

    await prisma.car.create({
      data: {
        model: faker.vehicle.model(),
        brand: faker.vehicle.manufacturer(),
        year: faker.date.past().getFullYear().toString(),
        garage: { connect: { id: garages[randGarageIndex]?.id } },
        user: { connect: { id: users[randUserIndex]?.id } },
      },
    });
  }

  logger.info('Car seeding done');
};
