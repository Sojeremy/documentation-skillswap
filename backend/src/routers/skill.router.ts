import { Router } from 'express';
import { getAllSkills } from '../controllers/profile.controller.ts';
import { checkAuth } from '../middlewares/auth.middleware.ts';

export const skillRouter = Router();

skillRouter.get('/', checkAuth, getAllSkills);
