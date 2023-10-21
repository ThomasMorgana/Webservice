import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';


export const seedUsers = async (prisma: PrismaClient) => {
	console.info('User seeding started');

	await prisma.user.deleteMany({});

	await prisma.user.create({
		data: {
			email: 'admin@mail.com',
			role: Role.ADMIN,
			password: await bcrypt.hash('password', 12),
		}
	});
  
	const amountOfUsers = 10;

	for(let i = 0; i < amountOfUsers; i++) {
		await prisma.user.create({
			data: {
				email: faker.internet.email(),
				password: await bcrypt.hash('password', 12),
			}
		});
	}

	console.info('User seeding done');
};