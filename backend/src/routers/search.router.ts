import { Router } from 'express';
import { checkAuth, validate } from '../middlewares/auth.middleware.ts';
import {
  getBestUsers,
  getUserSearch,
} from '../controllers/search.controller.ts';
import {
  SearchParamsSchema,
  TopRatedSchema,
} from '../validation/search.validation.ts';

export const searchRouter = Router();

searchRouter.get(
  '/',
  checkAuth,
  validate('query', SearchParamsSchema),
  getUserSearch,
);

searchRouter.get('/top-rated', validate('query', TopRatedSchema), getBestUsers);
