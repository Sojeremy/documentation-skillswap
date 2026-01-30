import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const addResponseMethodsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.success = <T>(data: T) => {
    const count = Array.isArray(data) ? data.length : 1;
    return res.json({ success: true, data, count });
  };
  res.created = <T>(data: T) => {
    const count = Array.isArray(data) ? data.length : 1;
    return res.status(StatusCodes.CREATED).json({ success: true, data, count });
  };
  res.deleted = () => {
    res.status(StatusCodes.NO_CONTENT).end();
  };
  next();
};
