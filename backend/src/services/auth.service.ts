import argon2 from 'argon2';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../lib/error.ts';
import { prisma, RoleOfUser } from '../models/index.ts';
import type {
  RegisterInput,
  LoginInput,
} from '../validation/auth.validation.ts';
import { generateAccessToken, generateRefreshToken } from '../lib/auth.ts';

export const registerService = async (data: RegisterInput) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (isUserExist) {
    throw new ConflictError('Email address already in use');
  }
  const hashedPassword = await argon2.hash(data.password);
  const userRole = await prisma.role.findFirst({
    where: {
      name: RoleOfUser.Membre,
    },
  });

  if (userRole === null) {
    throw new Error('Error');
  }

  const newUser = await prisma.user.create({
    data: {
      lastname: data.lastname,
      firstname: data.firstname,
      email: data.email,
      password: hashedPassword,
      roleId: userRole.id,
    },
  });
  const accessToken = generateAccessToken(newUser);
  const refreshToken = await generateRefreshToken(newUser);

  return {
    accessToken,
    refreshToken,
    user: {
      id: newUser.id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
    },
  };
};

export const loginService = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }
  const isPasswordValid = await argon2.verify(user.password, data.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  };
};

export const logoutService = async (refreshToken: string) => {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
};

export const refreshAccessTokenService = async (oldRefreshToken: string) => {
  const storedRefreshToken = await prisma.refreshToken.findFirst({
    where: { token: oldRefreshToken },
    include: { user: true },
  });
  if (!storedRefreshToken) {
    throw new UnauthorizedError('Invalid Refresh Token');
  }

  if (new Date() > storedRefreshToken.expireAt) {
    throw new UnauthorizedError('Token is expired');
  }

  const user = storedRefreshToken.user;
  if (!user) {
    throw new NotFoundError('User not found');
  }

  await prisma.refreshToken.deleteMany({
    where: { userId: user.id },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
  };
};

export const getMeService = async (userId: number) => {
  const user = prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      avatarUrl: true,
    },
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};
