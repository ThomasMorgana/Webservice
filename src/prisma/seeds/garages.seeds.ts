import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { logger } from '../../utils/logger';

export const seedGarages = async (prisma: PrismaClient) => {
  logger.info('Garage seeding started');

  await prisma.garage.deleteMany({});

  const amountOfGarages = 10;

  const users: User[] = await prisma.user.findMany({});

  for (let i = 0; i < amountOfGarages; i++) {
    const randUserIndex = Math.floor(Math.random() * users.length);

    await prisma.garage.create({
      data: {
        name: faker.location.city(),
        spaces: Math.floor(Math.random() * 10),
        user: { connect: { id: users[randUserIndex]?.id } },
      },
    });
  }

  logger.info('Garage seeding done');
};
