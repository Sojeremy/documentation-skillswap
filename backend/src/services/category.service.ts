import { Prisma, prisma } from '../models/index.ts';

interface GetAllUserCategoriesOptions {
  limit?: number;
  order?: 'popular' | 'alphabetical';
}

export type CategoryWithUserCountDB = {
  id: number;
  name: string;
  slug: string;
  user_count: number;
  skill_count: number;
  created_at: Date;
  updated_at: Date;
};

export type CategoryWithUserCount = {
  id: number;
  name: string;
  slug: string;
  userCount: number;
  skillCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function getTopUserCategoriesService(
  options: GetAllUserCategoriesOptions = {},
): Promise<CategoryWithUserCount[]> {
  const { limit } = options;

  // Build raw request to optimize performances (with order by clause)
  let query = Prisma.sql`
    SELECT 
      c.id,
      c.name,
      c.slug,
      COUNT(DISTINCT uhs.user_id) as user_count,
      COUNT(DISTINCT s.id) as skill_count,
      c.created_at,
      c.updated_at
    FROM category c
    LEFT JOIN skill s ON s.category_id = c.id
    LEFT JOIN user_has_skill uhs ON uhs.skill_id = s.id
    GROUP BY c.id, c.name, c.slug, c.created_at, c.updated_at
    ORDER BY user_count DESC
  `;

  // Add limit clause if it's defined by options
  if (limit) {
    query = Prisma.sql`${query} LIMIT ${limit}`;
  }

  // Execute query
  const result = await prisma.$queryRaw<CategoryWithUserCountDB[]>(query);

  return result.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    userCount: Number(cat.user_count),
    skillCount: Number(cat.skill_count),
    createdAt: cat.created_at,
    updatedAt: cat.updated_at,
  }));
}
