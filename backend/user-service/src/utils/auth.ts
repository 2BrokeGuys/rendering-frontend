import jwt from 'jsonwebtoken';
import { genJWTArgs } from '../types/auth';

export const generateJsonWebToken = ({ user, isAccess }: genJWTArgs) => {
  const jwtSecret = isAccess
    ? (process.env.JWT_ACCESS_TOKEN_SECRET as string)
    : (process.env.JWT_REFRESH_TOKEN_SECRET as string);

  return jwt.sign(user, jwtSecret, {
    expiresIn: isAccess ? '15m' : '7d'
  });
};
