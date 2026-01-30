import type { Request, Response } from 'express';
import {
  getUserSearchService,
  getBestUsersService,
} from '../services/search.service.ts';
import type { TopRatedSchemaType } from '../validation/search.validation.ts';

export const getUserSearch = async (req: Request, res: Response) => {
  const params = req.query;
  const userSearch = await getUserSearchService(params);
  res.success(userSearch);
};

export const getBestUsers = async (req: Request, res: Response) => {
  const params = req.query as unknown as TopRatedSchemaType;
  const topRated = await getBestUsersService(params);
  res.success(topRated);
};
