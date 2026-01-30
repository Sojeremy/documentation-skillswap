import { Router } from 'express';
import {
  getProfile,
  getPublicProfile,
  changeOwnProfile,
  addProfileSkills,
  deleteProfileSkills,
  addProfleInterests,
  deleteProfileInterests,
  addProfileAvailabilities,
  deleteOwnAvailabilities,
  deleteAccount,
  addRateToUser,
  changePassword,
  updateAvatar,
  deleteAvatar,
} from '../controllers/profile.controller.ts';
import {
  checkAuth,
  isOwner,
  parseNumericParams,
  validate,
} from '../middlewares/auth.middleware.ts';
import { requireFollow } from '../middlewares/conv.middleware.ts';
import {
  addProfileAvailabilitiesSchema,
  addRatingToUserSchema,
  addSkillsProfileSchema,
  updatePasswordSchema,
} from '../validation/profile.validation.ts';
import { uploadAvatar } from '../middlewares/upload.middleware.ts';

export const profileRouteur = Router();

profileRouteur.patch(
  '/avatar',
  checkAuth,
  uploadAvatar.single('avatar'),
  updateAvatar,
);

profileRouteur.delete('/avatar', checkAuth, deleteAvatar);
profileRouteur.post(
  '/skills',
  checkAuth,
  validate('body', addSkillsProfileSchema),
  addProfileSkills,
);

profileRouteur.post(
  '/interests',
  checkAuth,
  validate('body', addSkillsProfileSchema),
  addProfleInterests,
);

profileRouteur.post(
  '/availabilities',
  checkAuth,
  validate('body', addProfileAvailabilitiesSchema),
  addProfileAvailabilities,
);

profileRouteur.patch(
  '/password',
  checkAuth,
  validate('body', updatePasswordSchema),
  changePassword,
);

profileRouteur.delete('/', checkAuth, deleteAccount);

// Public endpoint for SEO - no authentication required
// Used by search engines, social media crawlers, and SSR
profileRouteur.get('/public/:id', parseNumericParams, getPublicProfile);

profileRouteur.get('/:id', checkAuth, parseNumericParams, getProfile);

profileRouteur.patch(
  '/:id',
  checkAuth,
  parseNumericParams,
  isOwner,
  changeOwnProfile,
);

profileRouteur.post(
  '/:id/rating',
  checkAuth,
  parseNumericParams,
  validate('body', addRatingToUserSchema),
  requireFollow({ source: 'params', field: 'id', allowSelf: false }),
  addRateToUser,
);

profileRouteur.delete(
  '/skills/:id',
  checkAuth,
  parseNumericParams,
  deleteProfileSkills,
);

profileRouteur.delete(
  '/interests/:id',
  checkAuth,
  parseNumericParams,
  deleteProfileInterests,
);

profileRouteur.delete(
  '/availabilities/:id',
  checkAuth,
  parseNumericParams,
  deleteOwnAvailabilities,
);
