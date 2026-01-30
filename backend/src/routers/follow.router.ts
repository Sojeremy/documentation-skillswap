import { Router } from 'express';
import {
  checkAuth,
  parseNumericParams,
} from '../middlewares/auth.middleware.ts';
import {
  followUser,
  getAllFollowers,
  getAllFollowing,
  unfollowUser,
} from '../controllers/follow.controller.ts';

export const followRouteur = Router();

followRouteur.get('/followers', checkAuth, getAllFollowers);
followRouteur.get('/following', checkAuth, getAllFollowing);
followRouteur.post('/:id/follow', checkAuth, parseNumericParams, followUser);
followRouteur.delete(
  '/:id/follow',
  checkAuth,
  parseNumericParams,
  unfollowUser,
);
