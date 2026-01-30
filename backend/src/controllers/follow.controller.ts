import type { Request, Response } from 'express';
import {
  followUserService,
  getAllFollowersService,
  getAllFollowingService,
  unfollowUserService,
} from '../services/follow.service.ts';

export const followUser = async (req: Request, res: Response) => {
  const followerId = req.userId; // L'utilisateur connecté
  const followedId = req.paramsId; // L'utilisateur à suivre
  const follow = await followUserService(followerId, followedId);
  res.created(follow);
};

export const unfollowUser = async (req: Request, res: Response) => {
  const followerId = req.userId; // L'utilisateur connecté
  const followedId = req.paramsId; // L'utilisateur à ne plus suivre
  await unfollowUserService(followerId, followedId);
  res.deleted();
};

export const getAllFollowers = async (req: Request, res: Response) => {
  const followerId = req.userId; // L'utilisateur connecté
  const followers = await getAllFollowersService(followerId);
  res.success(followers);
};
export const getAllFollowing = async (req: Request, res: Response) => {
  const followerId = req.userId; // L'utilisateur connecté
  const following = await getAllFollowingService(followerId);
  res.success(following);
};
