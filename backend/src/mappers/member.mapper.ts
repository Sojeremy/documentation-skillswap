import type { MemberDocument } from '../@types/search.types.ts';
import { NotFoundError } from '../lib/error.ts';
import { prisma } from '../models/index.ts';

function calculateAverageRating(evaluations: { score: number }[]): number {
  if (evaluations.length === 0) return 0;
  const sum = evaluations.reduce((acc, e) => acc + e.score, 0);
  return Math.round((sum / evaluations.length) * 10) / 10;
}

export const userToDocument = async (
  userId: number,
): Promise<MemberDocument> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      skills: {
        include: {
          skill: {
            include: {
              category: true,
            },
          },
        },
      },
      evaluationsReceived: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }
  const skills = user.skills.map((s) => s.skill.name);
  const skillIds = user.skills.map((s) => s.skillId);
  const categoryIds = [...new Set(user.skills.map((s) => s.skill.categoryId))];
  const categorySlugs = [
    ...new Set(user.skills.map((s) => s.skill.category.slug)),
  ];
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    fullname: `${user.firstname} ${user.lastname}`,
    avatarUrl: user.avatarUrl,
    city: user.city,
    description: user.description,
    rating: calculateAverageRating(user.evaluationsReceived),
    skills,
    skillIds,
    categoryIds,
    categorySlugs,
    evaluationCount: user.evaluationsReceived.length,
    createdAt: user.createdAt.getTime(),
  };
};
