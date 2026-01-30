import { Router } from 'express';
import { checkAuth } from '../middlewares/auth.middleware.ts';
import { getAllAvailabilities } from '../controllers/profile.controller.ts';

export const availabilityRouter = Router();

availabilityRouter.get('/', checkAuth, getAllAvailabilities);
