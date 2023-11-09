import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).send('Token not found');
    }

    const decoded = jwt.verify(token, String(process.env.JWT_ACCESS_SECRET)) as JwtPayload;

    const user = await userService.retrieveById(decoded.id);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).send('The user associated with this token does not exist anymore');
    }

    if (!user.active) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send('Account is not verified. Check your emails for the verification link.');
    }

    req.role = user.role;
    req.token = decoded;

    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).send('Wrong or expired token');
  }
};
