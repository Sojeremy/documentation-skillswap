import { Router } from 'express';
import { GetTopUserCategories } from '../controllers/category.controller.ts';
import { validate } from '../middlewares/auth.middleware.ts';
import { GetTopUserCategoriesQuerySchema } from '../validation/category.validation.ts';

export const categoryRouter = Router();

// GET /api/v1/categories
categoryRouter.get(
  '/top-rated',
  validate('query', GetTopUserCategoriesQuerySchema),
  GetTopUserCategories,
);
