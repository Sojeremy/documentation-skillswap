import argon2 from 'argon2';
import fs from 'fs/promises';
import path from 'path';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../lib/error.ts';
import { prisma } from '../models/index.ts';
import type {
  addProfileAvailabilitiesSchemaInput,
  addRatingToUserSchemaInput,
  addSkillsProfileSchemaInput,
  ChangeOwnProfileSchemaInput,
  updatePasswordData,
} from '../validation/profile.validation.ts';

import { indexMember, removeMember } from './search.service.ts';

/**
 * Public profile service for SEO - Returns TEASER data only
 *
 * Strategy: Show enough info for Google indexing + visitor interest,
 * but not enough to satisfy without registration (conversion funnel).
 *
 * Returned: firstname, lastnameInitial, city, avatar, description preview,
 *           skills, average rating, review count
 * Hidden: full name, full description, detailed reviews, availabilities, interests
 */
export const getPublicProfileService = async (profileId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: profileId },
    select: {
      id: true,
      firstname: true,
      lastname: true, // Needed to compute initial
      city: true,
      avatarUrl: true,
      description: true, // Will be truncated
      skills: {
        include: {
          skill: true,
        },
      },
      evaluationsReceived: {
        select: {
          score: true, // Only scores for average calculation
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError("L'utilisateur n'a pas été trouvé");
  }

  // Calculate teaser data
  const reviewCount = user.evaluationsReceived.length;
  const averageRating =
    reviewCount > 0
      ? Math.round(
          (user.evaluationsReceived.reduce((sum, r) => sum + r.score, 0) /
            reviewCount) *
            10,
        ) / 10
      : null;

  // Truncate description to 150 characters
  const descriptionPreview = user.description
    ? user.description.slice(0, 150) +
      (user.description.length > 150 ? '...' : '')
    : null;

  // Return teaser format (limited data for SEO + conversion)
  return {
    id: user.id,
    firstname: user.firstname,
    lastnameInitial: user.lastname
      ? user.lastname.charAt(0).toUpperCase() + '.'
      : '',
    city: user.city,
    avatarUrl: user.avatarUrl,
    descriptionPreview,
    skills: user.skills,
    averageRating,
    reviewCount,
  };
};

export const getProfileService = async (
  userId: number,
  userParamsId: number,
) => {
  // We verify that data returned on a profile that is not the same as
  // the authenticated user does not return personal information
  const omitFields =
    userId === userParamsId
      ? { roleId: true, password: true }
      : {
          password: true,
          email: true,
          roleId: true,
          address: true,
          postalCode: true,
          age: true,
        };

  const user = await prisma.user.findUnique({
    where: { id: userId === userParamsId ? userId : userParamsId },
    omit: omitFields,
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
      interests: {
        include: {
          skill: true,
        },
      },
      evaluationsReceived: {
        include: {
          evaluator: true,
        },
      },
      availabilities: {
        include: {
          available: true,
        },
        orderBy: {
          available: {
            day: 'asc',
          },
        },
      },
      followedUsers: true,
      followerUsers: true,
    },
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  if (userId === userParamsId) {
    return user;
  } else {
    const rated = await prisma.rating.findFirst({
      where: {
        evaluatorId: userId,
        evaluatedId: userParamsId,
      },
    });
    const followed = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followedId: userParamsId,
      },
    });

    console.log(user);

    // Check whether the profile viewed matches the logged-in user
    const followedBy = await prisma.follow.findFirst({
      where: {
        followerId: userParamsId,
        followedId: userId,
      },
    });
    const isRated = rated !== null;
    const isFollowing = followed !== null;
    const isFollowedBy = followedBy !== null;
    return {
      ...user,
      isRated,
      isFollowing,
      isFollowedBy,
    };
  }
};

export const changeOwnProfileService = async (
  connectedUser: number,
  data: ChangeOwnProfileSchemaInput,
) => {
  const user = await prisma.user.findUnique({
    where: { id: connectedUser },
    omit: {
      roleId: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  //Verify that the email address is not already taken
  if (data.email && data.email !== user.email) {
    const isEmailTaken = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (isEmailTaken) {
      throw new UnauthorizedError('Email address already in use');
    }
  }

  const uptdatedUser = await prisma.user.update({
    where: { id: connectedUser },
    data: {
      ...data,
    },
    omit: {
      password: true,
      roleId: true,
    },
  });

  //Reindex the user with meilisearch when the user updates their profile
  try {
    await indexMember(connectedUser);
  } catch (error) {
    console.error('Failed to update user:', error);
  }

  return uptdatedUser;
};

export const getAllSkillsService = async () => {
  const allSkills = await prisma.skill.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return allSkills;
};

export const addProfileSkillService = async (
  userId: number,
  data: addSkillsProfileSchemaInput,
) => {
  const skillId = data.skillId;
  const userHasSkill = await prisma.userHasSkill.findMany({
    where: { userId: userId },
  });

  //Check if the user already has 10 skills
  if (userHasSkill.length === 10) {
    throw new ConflictError('You cannot add additional skills.');
  }

  //Checked whether the user already has a skill
  const existingSkill = userHasSkill.find((s) => s.skillId === skillId);
  if (existingSkill) {
    throw new ConflictError('You already possess this skill.');
  }
  const createdSkill = await prisma.userHasSkill.create({
    data: {
      userId: userId,
      skillId: skillId,
    },
    include: {
      skill: true,
    },
  });

  //Reindex the user with meilisearch when the user updates their skills
  try {
    await indexMember(userId);
  } catch (error) {
    console.error('Failed to index user:', error);
  }

  return createdSkill;
};

export const deleteProfileSkillService = async (
  userId: number,
  paramsId: number,
) => {
  const skillToDelete = await prisma.userHasSkill.findMany({
    where: { userId: userId, skillId: paramsId },
  });
  if (skillToDelete.length === 0) {
    throw new NotFoundError('The resource does not exist');
  }

  await prisma.userHasSkill.deleteMany({
    where: { userId: userId, skillId: paramsId },
  });

  const deletedSkill = await prisma.userHasSkill.count({
    where: { userId: userId },
  });

  //We verify that the user no longer has any skills
  // and if this is the case, we remove them from meilisearch.
  if (deletedSkill === 0) {
    await removeMember(userId);
  }
};

// Interest = skills, so the addProfileSkills and
// addProfileInterest services are virtually identical.
export const addProfileInterestsService = async (
  userId: number,
  data: addSkillsProfileSchemaInput,
) => {
  const interestId = data.skillId;
  const userHasInterest = await prisma.userHasInterest.findMany({
    where: { userId: userId },
  });

  if (userHasInterest.length === 10) {
    throw new ConflictError('You cannot add additional interests.');
  }
  const existingInterest = userHasInterest.find(
    (i) => i.skillId === interestId,
  );

  if (existingInterest) {
    throw new ConflictError('You already have this interest');
  }
  const createdInterest = await prisma.userHasInterest.create({
    data: {
      userId: userId,
      skillId: interestId,
    },
    include: {
      skill: true,
    },
  });

  return createdInterest;
};

export const deleteProfileInterestService = async (
  userId: number,
  paramsId: number,
) => {
  const interestToDelete = await prisma.userHasInterest.findMany({
    where: { userId: userId, skillId: paramsId },
  });
  if (interestToDelete.length === 0) {
    throw new NotFoundError('The resource does not exist');
  }
  await prisma.userHasInterest.deleteMany({
    where: { userId: userId, skillId: paramsId },
  });
};

//For the front call api
export const getAllAvailabilitiesService = async () => {
  const availabilities = await prisma.available.findMany();
  if (availabilities.length === 0) {
    throw new NotFoundError('The resource does not exist');
  }
  return availabilities;
};

export const addProfileAvailabilitiesService = async (
  userId: number,
  data: addProfileAvailabilitiesSchemaInput,
) => {
  const available = await prisma.available.findFirst({
    where: {
      day: data.day,
      timeSlot: data.timeSlot,
    },
  });
  if (!available) {
    throw new NotFoundError('The resource does not exist');
  }

  const createAvailabilities = await prisma.userHasAvailable.create({
    data: {
      userId: userId,
      availableId: available.id,
    },
    include: {
      available: true,
    },
  });
  return createAvailabilities;
};

export const deleteOwnAvailabilitiesService = async (
  userId: number,
  paramsId: number,
) => {
  const availabilityToDelete = await prisma.userHasAvailable.findFirst({
    where: { userId: userId, availableId: paramsId },
  });
  if (!availabilityToDelete) {
    throw new NotFoundError('The resource does not exist');
  }
  await prisma.userHasAvailable.deleteMany({
    where: { userId: userId, availableId: paramsId },
  });
};

export const addRateToUserService = async (
  userId: number,
  paramsId: number,
  data: addRatingToUserSchemaInput,
) => {
  const existingRating = await prisma.rating.findFirst({
    where: {
      evaluatorId: userId,
      evaluatedId: paramsId,
    },
  });
  if (existingRating) {
    throw new ConflictError('You have already rated this user');
  }

  const creatingRate = await prisma.rating.create({
    data: {
      evaluatorId: userId,
      evaluatedId: paramsId,
      score: data.score,
      comments: data.comment,
    },
  });

  // You need to reindex the user who receives a notification
  // so that they appear in the search page with the new rating
  try {
    await indexMember(creatingRate.evaluatedId);
  } catch (error) {
    console.error('Failed to index user:', error);
  }

  return creatingRate;
};

export const changePasswordService = async (
  userId: number,
  data: updatePasswordData,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  //Check if old password = current password
  const isCurrentPasswordIsValid = await argon2.verify(
    user.password,
    data.currentPassword,
  );

  if (!isCurrentPasswordIsValid) {
    throw new ConflictError('Old password is incorrect');
  }

  //Hash the new password
  const hashedPassword = await argon2.hash(data.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });
};

export const deleteAccountService = async (userId: number) => {
  await prisma.user.deleteMany({
    where: { id: userId },
  });

  //Removes the user from meilisearch documents when they delete their account
  try {
    await removeMember(userId);
  } catch (error) {
    console.error('Failed to remove user from index:', error);
  }
};

export const updateAvatarService = async (
  userId: number,
  avatarPath: string,
) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarUrl: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Delete old avatar if exists
  if (user.avatarUrl) {
    try {
      const oldAvatarPath = path.join(process.cwd(), 'public', user.avatarUrl);
      await fs.unlink(oldAvatarPath);
    } catch (err) {
      // Ignore error if file doesn't exist
      console.log('Could not delete old avatar:', err);
    }
  }

  // Update user with new avatar URL
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      avatarUrl: `/avatars/${path.basename(avatarPath)}`,
    },
    omit: {
      password: true,
      roleId: true,
    },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
      interests: {
        include: {
          skill: true,
        },
      },
      evaluationsReceived: {
        include: {
          evaluator: true,
        },
      },
      availabilities: {
        include: {
          available: true,
        },
        orderBy: {
          available: {
            day: 'asc',
          },
        },
      },
    },
  });

  try {
    await indexMember(userId);
  } catch (error) {
    console.error('Failed to update profile picture:', error);
  }

  return updatedUser;
};

export const deleteAvatarService = async (userId: number) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarUrl: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Delete avatar file if exists
  if (user.avatarUrl) {
    try {
      const avatarPath = path.join(process.cwd(), 'public', user.avatarUrl);
      await fs.unlink(avatarPath);
    } catch (err) {
      console.log('Could not delete avatar file:', err);
    }
  }

  // Update user to remove avatar URL
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      avatarUrl: null,
    },
    omit: {
      password: true,
      roleId: true,
    },
  });

  return updatedUser;
};
