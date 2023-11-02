import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedRequest } from '../interfaces/auth.interface';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).send('Token not found');

  try {
    const decoded = jwt.verify(token, String(process.env.JWT_ACCESS_SECRET));
    const user = await userService.retrieveById((decoded as JwtPayload).id);

    if (!user) {
      res.status(404).send('The user associated with this token does not exist anymore');
      return;
    }

    (req as AuthenticatedRequest).role = user.role;
    (req as AuthenticatedRequest).token = decoded as JwtPayload;

    next();
  } catch (error) {
    res.status(401).send('Wrong or expired token');
  }
};
