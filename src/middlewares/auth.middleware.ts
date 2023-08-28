import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../interfaces/auth.interface";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).send("Token not found");

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    (req as AuthenticatedRequest).token = decoded as JwtPayload;
    next();
  } catch (error) {
    res.status(401).send("Wrong or expired token")
  }
}