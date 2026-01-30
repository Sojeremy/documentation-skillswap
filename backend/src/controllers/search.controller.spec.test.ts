import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  buildAuthedRequester,
  generateFakeUser,
  httpRequester,
} from '../test/index.ts';
import { prisma } from '../models/index.ts';
import { indexMember } from '../services/search.service.ts';
import type { SearchResponse } from '../@types/search.types.ts';

type ApiSuccess<T> = { success: true; data: T; count: number };
type TopRatedMember = {
  id: number;
  firstname: string;
  lastname: string;
  avatarUrl: string | null;
  skills: string[];
  rating: number;
  evaluationCount: number;
};

describe("[GET] /search/top-rated'", () => {
  it('should return the 6 more rated users with 200 status ', async () => {
    // ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const users = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        prisma.user.create({
          data: generateFakeUser({ roleId }),
        }),
      ),
    );

    const category = await prisma.category.create({
      data: { name: 'Dev', slug: 'dev' },
    });

    const skill = await prisma.skill.create({
      data: { name: 'JavaScript', categoryId: category.id },
    });

    await Promise.all(
      users.map((user) =>
        prisma.userHasSkill.create({
          data: { userId: user.id, skillId: skill.id },
        }),
      ),
    );

    await prisma.rating.createMany({
      data: [
        { evaluatorId: users[1].id, evaluatedId: users[0].id, score: 5 },
        { evaluatorId: users[2].id, evaluatedId: users[0].id, score: 5 },
      ],
    });

    await prisma.rating.createMany({
      data: [
        { evaluatorId: users[0].id, evaluatedId: users[1].id, score: 4 },
        { evaluatorId: users[2].id, evaluatedId: users[1].id, score: 5 },
      ],
    });

    await prisma.rating.create({
      data: { evaluatorId: users[0].id, evaluatedId: users[2].id, score: 4 },
    });

    await prisma.rating.createMany({
      data: [
        { evaluatorId: users[0].id, evaluatedId: users[3].id, score: 3 },
        { evaluatorId: users[1].id, evaluatedId: users[3].id, score: 4 },
      ],
    });

    await prisma.rating.create({
      data: { evaluatorId: users[0].id, evaluatedId: users[4].id, score: 3 },
    });

    await prisma.rating.createMany({
      data: [
        { evaluatorId: users[0].id, evaluatedId: users[5].id, score: 2 },
        { evaluatorId: users[1].id, evaluatedId: users[5].id, score: 3 },
      ],
    });
    console.log('MEILISEARCH_HOST:', process.env.MEILISEARCH_HOST);

    await Promise.all(users.map((u) => indexMember(u.id)));

    // ACT
    const response = await httpRequester.get('/search/top-rated?limit=6');

    const data = response.data as ApiSuccess<TopRatedMember[]>;
    assert.ok(Array.isArray(data.data));
    assert.strictEqual(data.data.length, 6, 'Should return 6 users by default');

    //check order
    assert.ok(data.data[0].rating >= data.data[1].rating);
    assert.ok(data.data[1].rating >= data.data[2].rating);

    assert.ok(data.data[0].id);
    assert.ok(data.data[0].firstname);
    assert.ok(data.data[0].lastname);
    assert.ok(Array.isArray(data.data[0].skills));
    assert.ok(typeof data.data[0].rating === 'number');
    assert.ok(typeof data.data[0].evaluationCount === 'number');
  });
  it('should return users sorted by rating DESC (best to worst)', async () => {
    // ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    // Créer 8 users
    const users = await Promise.all(
      Array.from({ length: 8 }, () =>
        prisma.user.create({
          data: generateFakeUser({ roleId }),
        }),
      ),
    );

    // Créer catégorie et skill
    const category = await prisma.category.create({
      data: { name: 'Dev', slug: 'dev' },
    });

    const skill = await prisma.skill.create({
      data: { name: 'JavaScript', categoryId: category.id },
    });

    // Donner une skill à chaque user
    await Promise.all(
      users.map((user) =>
        prisma.userHasSkill.create({
          data: { userId: user.id, skillId: skill.id },
        }),
      ),
    );

    // Créer des ratings avec différentes moyennes
    await prisma.rating.createMany({
      data: [
        // User 0 : moyenne 5.0
        { evaluatorId: users[1].id, evaluatedId: users[0].id, score: 5 },
        { evaluatorId: users[2].id, evaluatedId: users[0].id, score: 5 },
        // User 1 : moyenne 4.0
        { evaluatorId: users[0].id, evaluatedId: users[1].id, score: 4 },
        // User 2 : moyenne 3.5
        { evaluatorId: users[0].id, evaluatedId: users[2].id, score: 3 },
        { evaluatorId: users[1].id, evaluatedId: users[2].id, score: 4 },
        // User 3 : moyenne 2.0
        { evaluatorId: users[0].id, evaluatedId: users[3].id, score: 2 },
        // User 4 : moyenne 1.0
        { evaluatorId: users[0].id, evaluatedId: users[4].id, score: 1 },
      ],
    });

    // ACT
    const response = await httpRequester.get('/search/top-rated?limit=6');

    // ASSERT
    assert.strictEqual(response.status, 200);

    const data = response.data as ApiSuccess<TopRatedMember[]>;
    const ratedUsers = data.data;

    // Vérifier qu'il y a au moins 5 users notés
    assert.ok(ratedUsers.length >= 5);

    // Vérifier le tri décroissant (meilleur → moins bon)
    for (let i = 1; i < ratedUsers.length; i++) {
      assert.ok(
        ratedUsers[i].rating <= ratedUsers[i - 1].rating,
        `User at index ${i} (rating: ${ratedUsers[i].rating}) should have rating <= User at index ${i - 1} (rating: ${ratedUsers[i - 1].rating})`,
      );
    }

    // Vérifier que le meilleur est bien en premier
    assert.strictEqual(
      ratedUsers[0].id,
      users[0].id,
      'Best rated user should be first',
    );
    assert.strictEqual(
      ratedUsers[0].rating,
      5,
      'Best user should have rating 5.0',
    );
  });
});
describe('[GET] /search', () => {
  it('should return search results with 200 status', async () => {
    // ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);
    // Créer quelques users avec cette skill
    const users = await Promise.all(
      Array.from({ length: 15 }, () =>
        prisma.user.create({
          data: generateFakeUser({ roleId }),
        }),
      ),
    );
    const user = users[0];
    const authedRequester = buildAuthedRequester(user);

    // Créer une catégorie et skill
    const category = await prisma.category.create({
      data: { name: 'Développement Web', slug: 'dev-web' },
    });

    const skill = await prisma.skill.create({
      data: { name: 'React', categoryId: category.id },
    });

    // Donner la skill React à tous
    await Promise.all(
      users.map((user) =>
        prisma.userHasSkill.create({
          data: { userId: user.id, skillId: skill.id },
        }),
      ),
    );

    // ACT
    const response = await authedRequester.get(
      '/search?q=react&page=1&limit=12',
    );

    // ASSERT
    assert.strictEqual(response.status, 200);

    const data = response.data as ApiSuccess<SearchResponse>;

    // Vérifier la structure
    assert.ok(Array.isArray(data.data.members));
    assert.ok(typeof data.data.total === 'number');
    assert.strictEqual(data.data.page, 1);
    assert.ok(typeof data.data.totalPages === 'number');
    assert.ok(typeof data.data.processingTimeMs === 'number');

    // Vérifier le limit
    assert.ok(data.data.members.length <= 12);
  });
});
