import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedRequest } from '../interfaces/auth.interface';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).send('Token not found');
    }

    const decoded = jwt.verify(token, String(process.env.JWT_ACCESS_SECRET)) as JwtPayload;

    const user = await userService.retrieveById(decoded.id);

    if (!user) {
      return res.status(404).send('The user associated with this token does not exist anymore');
    }

    (req as AuthenticatedRequest).role = user.role;
    (req as AuthenticatedRequest).token = decoded;

    next();
  } catch (error) {
    res.status(401).send('Wrong or expired token');
  }
};
