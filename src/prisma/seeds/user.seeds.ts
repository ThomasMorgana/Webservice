import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcryptjs from 'bcryptjs';
import { logger } from '../../utils/logger';

export const seedUsers = async (prisma: PrismaClient) => {
  logger.info('User seeding started');

  await prisma.user.deleteMany({});

  await prisma.user.create({
    data: {
      email: 'admin@mail.com',
      role: Role.ADMIN,
      active: true,
      password: await bcryptjs.hash('password', 12),
    },
  });

  await prisma.user.create({
    data: {
      email: 'user@mail.com',
      role: Role.USER,
      active: true,
      password: await bcryptjs.hash('password', 12),
    },
  });

  const amountOfUsers = 10;

  for (let i = 0; i < amountOfUsers; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        active: i % 4 != 0,
        password: await bcryptjs.hash('password', 12),
      },
    });
  }

  logger.info('User seeding done');
};
