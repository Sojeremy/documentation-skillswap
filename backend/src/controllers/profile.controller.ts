import type { Request, Response } from 'express';
import {
  addProfileAvailabilitiesService,
  addProfileInterestsService,
  addProfileSkillService,
  addRateToUserService,
  changeOwnProfileService,
  changePasswordService,
  deleteAccountService,
  deleteOwnAvailabilitiesService,
  deleteProfileInterestService,
  deleteProfileSkillService,
  getAllAvailabilitiesService,
  getAllSkillsService,
  getProfileService,
  getPublicProfileService,
  updateAvatarService,
  deleteAvatarService,
} from '../services/profile.service.ts';
import { BadRequestError } from '../lib/error.ts';

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.userId;
  const paramsUserId = req.paramsId;
  const user = await getProfileService(userId, paramsUserId);
  res.success(user);
};

/**
 * Public profile endpoint for SEO (no auth required)
 * Returns only public data - used by search engines and social media crawlers
 */
export const getPublicProfile = async (req: Request, res: Response) => {
  const profileId = req.paramsId;
  const user = await getPublicProfileService(profileId);
  res.success(user);
};

export const changeOwnProfile = async (req: Request, res: Response) => {
  const connectedUser = req.paramsId;
  const data = req.body;
  const changeProfileUser = await changeOwnProfileService(connectedUser, data);
  res.success(changeProfileUser);
};

export const getAllSkills = async (req: Request, res: Response) => {
  const allSkills = await getAllSkillsService();
  res.success(allSkills);
};

export const addProfileSkills = async (req: Request, res: Response) => {
  const userId = req.userId;
  const data = req.body;
  const skill = await addProfileSkillService(userId, data);
  res.created(skill);
};

export const deleteProfileSkills = async (req: Request, res: Response) => {
  const userId = req.userId;
  const paramsId = req.paramsId;
  await deleteProfileSkillService(userId, paramsId);
  res.deleted();
};

export const addProfleInterests = async (req: Request, res: Response) => {
  const userId = req.userId;
  const data = req.body;
  const interest = await addProfileInterestsService(userId, data);
  res.created(interest);
};

export const deleteProfileInterests = async (req: Request, res: Response) => {
  const userId = req.userId;
  const paramsId = req.paramsId;
  await deleteProfileInterestService(userId, paramsId);
  res.deleted();
};

export const getAllAvailabilities = async (req: Request, res: Response) => {
  const allAvailabilities = await getAllAvailabilitiesService();
  res.success(allAvailabilities);
};

export const addProfileAvailabilities = async (req: Request, res: Response) => {
  const userId = req.userId;
  const data = req.body;
  const availabilities = await addProfileAvailabilitiesService(userId, data);
  res.created(availabilities);
};

export const deleteOwnAvailabilities = async (req: Request, res: Response) => {
  const userId = req.userId;
  const paramsId = req.paramsId;
  await deleteOwnAvailabilitiesService(userId, paramsId);
  res.deleted();
};

export const addRateToUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  const paramsId = req.paramsId;
  const data = req.body;
  const rate = await addRateToUserService(userId, paramsId, data);
  res.success(rate);
};

export const changePassword = async (req: Request, res: Response) => {
  const userId = req.userId;
  const data = req.body;
  await changePasswordService(userId, data);
  res.success({ message: 'Le mot de passe à bien été modifié' });
};

export const deleteAccount = async (req: Request, res: Response) => {
  const userId = req.userId;
  await deleteAccountService(userId);
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
  res.clearCookie('accessTokenExpires');

  res.deleted();
};

export const updateAvatar = async (req: Request, res: Response) => {
  const userId = req.userId;

  // Check if file was uploaded
  if (!req.file) {
    throw new BadRequestError('Aucun fichier fourni');
  }

  // Update avatar in database
  const updatedUser = await updateAvatarService(userId, req.file.path);

  res.success(updatedUser);
};

export const deleteAvatar = async (req: Request, res: Response) => {
  const userId = req.userId;

  // Delete avatar from database and filesystem
  const updatedUser = await deleteAvatarService(userId);

  res.success(updatedUser);
};
