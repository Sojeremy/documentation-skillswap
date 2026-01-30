import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError, BadRequestError } from '../lib/error.ts';
import { prisma } from '../models/index.ts';

type RequireFollowConfig = {
  source: 'body' | 'params' | 'query';
  field: string;
  allowSelf: boolean;
};

export const requireFollow = (config: RequireFollowConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // D'ou on recup l'id
      const rawId = req[config.source][config.field];
      //Si c'est une string on le transforme en number
      const targetId = Number(rawId);
      //Si c'est un nombre entier valide
      if (!Number.isInteger(targetId) || targetId <= 0) {
        return next(
          new BadRequestError('Id is required and must be a valid id.'),
        );
      }
      const connectedUser = req.userId;
      //Si on autorise pas de se follow + le target id = userId
      if (!config.allowSelf && targetId === connectedUser) {
        return next(
          new BadRequestError('Vous ne pouvez pas suivre votre propre compte'),
        );
      }
      // Si il le follow pas
      const follows = await prisma.follow.findFirst({
        where: {
          followerId: connectedUser,
          followedId: targetId,
        },
      });
      if (!follows) {
        return next(new ForbiddenError('Vous ne suivez pas cette personne'));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireMutualFollow = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const [a, b] = [req.body.receiverId, req.userId];

    const follows = await prisma.follow.findMany({
      where: {
        OR: [
          { followerId: a, followedId: b },
          { followerId: b, followedId: a },
        ],
      },
      select: { followerId: true, followedId: true },
    });

    if (follows.length < 2) {
      return next(
        new ForbiddenError('You can only message users who follow you back.'),
      );
    }

    next();
  } catch (e) {
    next(e);
  }
};

export const requireSimpleFollow = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const receiverId = Number(req.body.receiverId) || Number(req.paramsId);
    const senderId = req.userId;

    if (!Number.isInteger(receiverId) || receiverId <= 0) {
      return next(
        new BadRequestError('receiverId is required and must be a valid id.'),
      );
    }

    if (receiverId === senderId) {
      return next(
        new BadRequestError('You cannot start a conversation with yourself.'),
      );
    }

    const follow = await prisma.follow.findFirst({
      where: {
        followerId: senderId,
        followedId: receiverId,
      },
      select: { followerId: true, followedId: true },
    });

    if (!follow) {
      return next(new ForbiddenError('You can only message users you follow.'));
    }

    next();
  } catch (e) {
    next(e);
  }
};
