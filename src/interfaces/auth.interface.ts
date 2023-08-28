import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { Role } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
  token: JwtPayload
  role: Role
}