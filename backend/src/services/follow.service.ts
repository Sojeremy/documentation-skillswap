import { ConflictError, NotFoundError } from '../lib/error.ts';
import { prisma } from '../models/index.ts';

export const followUserService = async (
  followerId: number,
  followedId: number,
) => {
  // Check that you are not following yourself
  if (followerId === followedId) {
    throw new ConflictError('Vous ne pouvez pas vous suivre vous-même');
  }

  // Check that the follow does not already exist
  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId,
      followedId,
    },
  });

  if (existingFollow) {
    throw new ConflictError('Vous suivez déjà cet utilisateur');
  }

  // Create the follow
  const follow = await prisma.follow.create({
    data: {
      followerId,
      followedId,
    },
  });

  return follow;
};

export const unfollowUserService = async (
  followerId: number,
  followedId: number,
) => {
  // Verify that the follow exists
  const existingFollow = await prisma.follow.findFirst({
    where: {
      followerId,
      followedId,
    },
  });

  if (!existingFollow) {
    throw new NotFoundError('Vous ne suivez pas cet utilisateur');
  }

  // Remove follow
  await prisma.follow.delete({
    where: {
      id: existingFollow.id,
    },
  });
};

// Get all followers
export const getAllFollowersService = async (userId: number) => {
  const followers = await prisma.follow.findMany({
    where: { followedId: userId },
    include: {
      follower: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatarUrl: true,
        },
      },
    },
  });
  return followers.map((f) => f.follower);
};

// Get all following
export const getAllFollowingService = async (userId: number) => {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      followed: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatarUrl: true,
        },
      },
    },
  });
  return following.map((f) => f.followed);
};
