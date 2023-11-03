import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

const generateToken = (user: User, secret: string, expiresIn: string) => {
  return jwt.sign({ id: user.id }, secret, {
    expiresIn,
  });
};

export const generateAccessToken = (user: User) => {
  return generateToken(user, process.env.JWT_ACCESS_SECRET as string, '5m');
};

export const generateRefreshToken = (user: User) => {
  return generateToken(user, process.env.JWT_REFRESH_SECRET as string, '1y');
};
