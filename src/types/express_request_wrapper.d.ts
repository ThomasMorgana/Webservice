import { Role } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

export {};

declare global {
  namespace Express {
    interface Request {
      role?: Role;
      token?: JwtPayload;
    }
  }
}
