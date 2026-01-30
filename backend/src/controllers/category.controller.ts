import type { Request, Response } from 'express';
import { getTopUserCategoriesService } from '../services/category.service.ts';

export const GetTopUserCategories = async (req: Request, res: Response) => {
  const categories = await getTopUserCategoriesService(req.query);

  return res.success(categories);
};
