import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { config } from '../../config.ts';
import { prisma, type User } from '../models/index.ts';
import type { Request } from 'express';
import crypto from 'node:crypto';
import { UnauthorizedError } from './error.ts';

export const generateAccessToken = (user: User) => {
  const expiresIn = Number(config.token_expire);
  const payload = {
    userId: user.id,
    userRole: user.roleId,
  };
  const accessToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn,
  });
  return accessToken;
};
export const generateRefreshToken = async (user: User) => {
  const refreshToken = crypto.randomBytes(64).toString('base64');

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return refreshToken;
};

export interface UserPayload extends JwtPayload {
  userId: number;
  userRole: number;
}

export const decodeAccesToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;
    return decoded;
  } catch {
    throw new UnauthorizedError('Invalid Token');
  }
};

export const extractAccessTokenFromReq = (req: Request) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new UnauthorizedError('Authorization header missing or malformed');
  }

  return accessToken;
};

export const extractRefreshTokenFromReq = (req: Request) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedError('Refresh token missing');
  }
  return refreshToken;
};
