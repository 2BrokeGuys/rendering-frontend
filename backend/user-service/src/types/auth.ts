import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export type genJWTArgs = {
  user: object;
  isAccess: boolean;
};

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
