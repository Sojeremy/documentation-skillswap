import { prisma } from '../models/index.ts';
import { membersIndex } from '../lib/mailisearch.ts';

import { userToDocument } from '../mappers/member.mapper.ts';
import type { MemberDocument, SearchResponse } from '../@types/search.types.ts';
import type {
  SearchParamsType,
  TopRatedSchemaType,
} from '../validation/search.validation.ts';

//Index a member
export const indexMember = async (userId: number): Promise<void> => {
  const document = await userToDocument(userId);
  await membersIndex.addDocuments([document]);
};

// Indexe all members
export const indexAllMembers = async (): Promise<number> => {
  const user = await prisma.user.findMany();
  const documents = await Promise.all(user.map((u) => userToDocument(u.id)));
  await membersIndex.addDocuments(documents);
  return documents.length;
};

// Delete member
export const removeMember = async (userId: number): Promise<void> => {
  await membersIndex.deleteDocument(userId);
};

export const getUserSearchService = async (
  params: SearchParamsType,
): Promise<SearchResponse> => {
  const {
    q = '',
    category,
    page = 1,
    limit = 12,
    sort = 'rating:desc',
  } = params;
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(50, Math.max(1, limit));
  const offset = (pageNum - 1) * limitNum;

  const filters: string[] = [];
  if (category && category !== 'all') {
    filters.push(`categorySlugs = "${category}"`);
  }

  const searchResult = await membersIndex.search(q, {
    filter: filters.length > 0 ? filters.join(' AND ') : undefined,
    sort: sort ? [sort] : undefined,
    limit: limitNum,
    offset,
    attributesToRetrieve: [
      'id',
      'firstname',
      'lastname',
      'fullname',
      'avatarUrl',
      'city',
      'description',
      'skills',
      'rating',
      'evaluationCount',
      'createdAt',
    ],
  });

  const total = searchResult.estimatedTotalHits || 0;

  return {
    members: searchResult.hits as MemberDocument[],
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    processingTimeMs: searchResult.processingTimeMs,
  };
};

export const getBestUsersService = async (params: TopRatedSchemaType) => {
  const users = await prisma.user.findMany({
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

  const averageOfUser = users.map((user) => {
    const average =
      user.evaluationsReceived.length > 0
        ? user.evaluationsReceived.reduce(
            (sum, rating) => sum + rating.score,
            0,
          ) / user.evaluationsReceived.length
        : 0;

    return {
      ...user,
      average,
    };
  });
  const topUsers = averageOfUser
    .sort((a, b) => b.average - a.average)
    .slice(0, params.limit);

  return topUsers.map((user) => ({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    avatarUrl: user.avatarUrl,
    skills: user.skills.map((s) => s.skill.name),
    rating: user.average,
    evaluationCount: user.evaluationsReceived.length,
  }));
};
