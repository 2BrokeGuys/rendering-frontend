import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export type AuthenticatedUserJWT = {
  id: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
};
