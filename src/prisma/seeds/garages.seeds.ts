import { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const seedGarages = async (prisma: PrismaClient) => {
	console.info('Garage seeding started');

	await prisma.garage.deleteMany({});

	const amountOfGarages = 10;

	const users: User[] = await prisma.user.findMany({});

	for(let i = 0; i < amountOfGarages; i++) {
		const randUserIndex = Math.floor(Math.random() * users.length);

		await prisma.garage.create({
			data: {
				name: faker.location.city(),
				spaces: Math.floor(Math.random() * 10),
				user: { connect: { id : users[randUserIndex]?.id}}
			}
		});
	}

	console.info('Garage seeding done');

};