import type { Request, Response } from 'express';
import {
  registerService,
  loginService,
  logoutService,
  refreshAccessTokenService,
  getMeService,
} from '../services/auth.service.ts';
import { config } from '../../config.ts';
import { extractRefreshTokenFromReq } from '../lib/auth.ts';

export const register = async (req: Request, res: Response) => {
  const userData = req.body;
  const accessTokenExpires = Number(config.token_expire);
  const { accessToken, user, refreshToken } = await registerService(userData);
  setTokenInCookie(res, accessTokenExpires, accessToken);
  setRefreshTokenInCookie(res, refreshToken);
  res.created(user);
};

export const login = async (req: Request, res: Response) => {
  const userData = req.body;
  const accessTokenExpires = Number(config.token_expire);
  const { accessToken, refreshToken, user } = await loginService(userData);
  setTokenInCookie(res, accessTokenExpires, accessToken);
  setRefreshTokenInCookie(res, refreshToken);
  res.success(user);
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = extractRefreshTokenFromReq(req);

  await logoutService(refreshToken);

  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
  res.clearCookie('accessTokenExpires');

  res.deleted();
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const oldRefreshToken = extractRefreshTokenFromReq(req);

  const accessTokenExpires = Number(config.token_expire);
  const { accessToken, refreshToken } =
    await refreshAccessTokenService(oldRefreshToken);
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('accessTokenExpires');
  setTokenInCookie(res, accessTokenExpires, accessToken);
  setRefreshTokenInCookie(res, refreshToken);

  res.success({ message: 'Token are refreshing' });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.userId;
  const infoUser = await getMeService(userId);
  res.success(infoUser);
};

export const setTokenInCookie = (
  res: Response,
  accessTokenExpires: number,
  accessToken: string,
) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, {
    expires: new Date(Date.now() + accessTokenExpires * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
  });
  res.cookie('accessTokenExpires', accessTokenExpires, {
    expires: new Date(Date.now() + accessTokenExpires * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
  });
};

export const setRefreshTokenInCookie = (
  res: Response,
  refreshToken: string,
) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
  });
};
