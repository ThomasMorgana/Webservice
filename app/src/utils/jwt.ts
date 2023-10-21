import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const generateAccessToken = (user: User) => {
	return jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET as string, {
		expiresIn: '5m',
	});
};

export const generateRefreshToken = (user: User) => {
	return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as string, {
		expiresIn: '1y',
	});
};
