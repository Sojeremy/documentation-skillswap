import type { NextFunction, Request, Response } from 'express';
import type { ZodObject } from 'zod';
import { decodeAccesToken, extractAccessTokenFromReq } from '../lib/auth.ts';
import { ForbiddenError, UnauthorizedError } from '../lib/error.ts';

type DataSource = 'body' | 'params' | 'query';

export const validate = (dataSource: DataSource, schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync(req[dataSource]);
    next();
  };
};

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = extractAccessTokenFromReq(req);
    const decoded = decodeAccesToken(accessToken);
    req.userId = decoded.userId;
    req.userRole = decoded.userRole;

    next();
  } catch {
    next(new UnauthorizedError('Acces denied'));
  }
};

export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  const authentifiedUser = req.userId;
  const paramsId = Number(req.params.id);
  if (authentifiedUser !== paramsId) {
    next(new ForbiddenError("Vous n'avez pas accès à cette ressource"));
  } else {
    next();
  }
};

export const parseNumericParams = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.paramsId = Number(req.params.id);
  next();
};
