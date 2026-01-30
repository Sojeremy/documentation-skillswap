import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  buildAuthedRequester,
  generateFakeUser,
  httpRequester,
} from '../test/index.ts';
import { prisma } from '../models/index.ts';

type ApiSuccess<T> = { success: true; data: T; count: number };

describe('[GET] /follows/followers', () => {
  it('should return a list of the user followers', async () => {
    //ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const userA = generateFakeUser({ roleId: roleId });
    await prisma.user.create({ data: userA });

    const userB = await prisma.user.create({
      data: generateFakeUser({ roleId }),
    });

    const userC = await prisma.user.create({
      data: generateFakeUser({ roleId }),
    });

    const userD = await prisma.user.create({
      data: generateFakeUser({ roleId }),
    });

    await prisma.follow.create({
      data: { followerId: userB.id, followedId: userA.id },
    });
    await prisma.follow.create({
      data: { followerId: userC.id, followedId: userA.id },
    });

    await prisma.follow.create({
      data: { followerId: userD.id, followedId: userA.id },
    });
    const requesterA = buildAuthedRequester(userA);

    //ACT

    const response = await requesterA.get('/follows/followers');

    //ASSERT

    assert.strictEqual(response.status, 200);
    const data = response.data as ApiSuccess<any[]>;
    assert.ok(Array.isArray(data.data), 'Should return an array');
    assert.strictEqual(data.data.length, 3, 'Should have 3 followers');
    assert.strictEqual(data.count, 3, 'Count should be 3');

    const followerIds = data.data.map((f: any) => f.id);
    assert.ok(followerIds.includes(userB.id), 'Should include userB');
    assert.ok(followerIds.includes(userC.id), 'Should include userC');
    assert.ok(followerIds.includes(userD.id), 'Should include userD');
  });
  it("should return a 401 if it's a visitor", async () => {
    //ARRANGE

    //ACT

    const response = await httpRequester.get('/follows/followers');

    //ASSERT

    assert.strictEqual(response.status, 401);
  });
});
describe('[GET] /follows/following', () => {
  it('should return a list of users that the authenticated user follows', async () => {
    //ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);
    const userA = generateFakeUser({ roleId });
    await prisma.user.create({ data: userA });

    const userB = await prisma.user.create({
      data: generateFakeUser({ roleId }),
    });
    const userC = await prisma.user.create({
      data: generateFakeUser({ roleId }),
    });
    const userD = await prisma.user.create({
      data: generateFakeUser({ roleId }),
    });

    await prisma.follow.create({
      data: { followerId: userA.id, followedId: userB.id },
    });
    await prisma.follow.create({
      data: { followerId: userA.id, followedId: userC.id },
    });
    await prisma.follow.create({
      data: { followerId: userA.id, followedId: userD.id },
    });

    const requesterA = buildAuthedRequester(userA);

    //ACT
    const response = await requesterA.get('/follows/following');

    //ASSERT
    assert.strictEqual(response.status, 200);

    const data = response.data as ApiSuccess<any[]>;
    assert.strictEqual(data.data.length, 3, 'Should follow 3 users');
    assert.strictEqual(data.count, 3);
  });

  it('should return a 401 if user is not authenticated', async () => {
    //ACT
    const response = await httpRequester.get('/follows/following');

    //ASSERT
    assert.strictEqual(response.status, 401);
  });
});
describe('[POST] /follows/:id/follow', () => {
  it('should return a 201 status when user follow an other user', async () => {
    //ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const userA = generateFakeUser({ roleId: roleId });
    await prisma.user.create({ data: userA });

    const userB = await prisma.user.create({
      data: generateFakeUser({ roleId }),
    });

    const requesterA = buildAuthedRequester(userA);
    //ACT
    const response = await requesterA.post(`/follows/${userB.id}/follow`);

    //ASSERT
    assert.strictEqual(response.status, 201);
    const follow = await prisma.follow.findFirst({
      where: {
        followerId: userA.id,
        followedId: userB.id,
      },
    });
    assert.ok(follow, 'Follow should be created');
  });
  it('should return a 409 status if user already follow the other user ', async () => {
    //ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const userA = generateFakeUser({ roleId: roleId });
    await prisma.user.create({ data: userA });

    const userB = await prisma.user.create({
      data: generateFakeUser({ roleId }),
    });

    const requesterA = buildAuthedRequester(userA);

    await prisma.follow.create({
      data: { followerId: userA.id, followedId: userB.id },
    });
    //ACT
    const response = await requesterA.post(`/follows/${userB.id}/follow`);

    //ASSERT
    assert.strictEqual(response.status, 409);
    assert.ok((response.data as any).error, 'Should have error message');
  });
});
describe('[DELETE] /follow/:id/follow', () => {
  it('should return a 204 when user unfollow other user', async () => {
    const roleId = Number(process.env.TEST_ROLE_ID);

    const userA = generateFakeUser({ roleId: roleId });
    await prisma.user.create({ data: userA });

    const userB = await prisma.user.create({
      data: generateFakeUser({ roleId }),
    });

    const requesterA = buildAuthedRequester(userA);

    await prisma.follow.create({
      data: { followerId: userA.id, followedId: userB.id },
    });
    //ACT
    const response = await requesterA.delete(`/follows/${userB.id}/follow`);

    //ASSERT
    assert.strictEqual(response.status, 204);
    const deletedFollow = await prisma.follow.findFirst({
      where: {
        followerId: userA.id,
        followedId: userB.id,
      },
    });
    assert.strictEqual(deletedFollow, null, 'Follow should be deleted');
  });
  it('should return a 404 when user unfollow  trying to unfollow a other user who dont follow', async () => {
    const roleId = Number(process.env.TEST_ROLE_ID);

    const userA = generateFakeUser({ roleId: roleId });
    await prisma.user.create({ data: userA });

    const userB = await prisma.user.create({
      data: generateFakeUser({ roleId }),
    });

    const requesterA = buildAuthedRequester(userA);

    //ACT
    const response = await requesterA.delete(`/follows/${userB.id}/follow`);

    //ASSERT
    assert.strictEqual(response.status, 404);
    assert.ok((response.data as any).error, 'Should have error message');
  });
});
