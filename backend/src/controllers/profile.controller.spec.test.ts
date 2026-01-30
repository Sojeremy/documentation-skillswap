import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  buildAuthedRequester,
  generateFakeUser,
  httpRequester,
} from '../test/index.ts';
import { prisma } from '../models/index.ts';

type ApiSuccess<T> = { success: true; data: T; count: number };
type ErrorResponse = {
  error: string | null;
};

describe('[GET] /skills/', () => {
  it('should return all skills for authenticated users', async () => {
    // ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const userA = generateFakeUser({ roleId: roleId });
    await prisma.user.create({ data: userA });

    const category = await prisma.category.create({
      data: { name: 'Développement Web', slug: 'dev-web' },
    });

    await prisma.skill.createMany({
      data: [
        { name: 'JavaScript', categoryId: category.id },
        { name: 'React', categoryId: category.id },
        { name: 'Node.js', categoryId: category.id },
      ],
    });
    const requesterA = buildAuthedRequester(userA);

    //ACT
    const response = await requesterA.get('/skills/');
    //ASSERT
    assert.strictEqual(response.status, 200);
    const data = response.data as ApiSuccess<
      Array<{
        id: number;
        name: string;
        categoryId: number;
      }>
    >;
    assert.ok(Array.isArray(data.data), 'Should return an array');
    assert.strictEqual(data.data.length, 3, 'Should return 3 skills');

    const firstSkill = data.data[0];
    assert.ok(firstSkill.id);
    assert.ok(firstSkill.name);
    assert.ok(firstSkill.categoryId);
  });
  it('should return a 401 if user is not authenticated', async () => {
    //ARRANGE
    //ACT
    const response = await httpRequester.get('/profiles/skills');
    //ASSERT
    assert.strictEqual(response.status, 401);
  });
});
describe('[POST] /profiles/skills', () => {
  it('should return a list of selectionned skills', async () => {
    // ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const userA = generateFakeUser({ roleId: roleId });
    await prisma.user.create({ data: userA });

    const category = await prisma.category.create({
      data: { name: 'Développement Web', slug: 'dev-web' },
    });

    await prisma.skill.createMany({
      data: [
        { id: 1, name: 'JavaScript', categoryId: category.id },
        { id: 2, name: 'React', categoryId: category.id },
        { id: 3, name: 'Node.js', categoryId: category.id },
      ],
    });

    const oneSkill = await prisma.skill.findFirst({
      where: {
        name: 'JavaScript',
      },
    });

    const requesterA = buildAuthedRequester(userA);

    //ACT
    const response = await requesterA.post('/profiles/skills', {
      skillId: oneSkill!.id,
    });
    //ASSERT
    assert.strictEqual(response.status, 201);
  });
  it('should return a 409 if user already have this skills', async () => {
    //ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const userA = generateFakeUser({ roleId: roleId });
    await prisma.user.create({ data: userA });

    const category = await prisma.category.create({
      data: { name: 'Développement Web', slug: 'dev-web' },
    });

    await prisma.skill.createMany({
      data: [
        { id: 1, name: 'JavaScript', categoryId: category.id },
        { id: 2, name: 'React', categoryId: category.id },
        { id: 3, name: 'Node.js', categoryId: category.id },
      ],
    });
    const oneSkill = await prisma.skill.findFirst({
      where: {
        name: 'JavaScript',
      },
    });

    await prisma.userHasSkill.createMany({
      data: {
        userId: userA.id,
        skillId: oneSkill!.id,
      },
    });
    const userSkills = await prisma.userHasSkill.findMany({
      where: {
        userId: userA.id,
        skillId: oneSkill!.id,
      },
    });
    const requesterA = buildAuthedRequester(userA);

    //ACT
    const response = await requesterA.post('/profiles/skills', {
      skillId: oneSkill!.id,
    });
    //ASSERT
    assert.strictEqual(response.status, 409);
    assert.strictEqual(userSkills.length, 1, 'Should still have only 1 skill');
  });
});
describe('[DELETE] /profiles/skills/:id', () => {
  it('should return a 204 if skill is deleted by user', async () => {
    //ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);
    const userA = generateFakeUser({ roleId: roleId });
    await prisma.user.create({ data: userA });

    const category = await prisma.category.create({
      data: { name: 'Développement Web', slug: 'dev-web' },
    });

    await prisma.skill.createMany({
      data: [
        { id: 1, name: 'JavaScript', categoryId: category.id },
        { id: 2, name: 'React', categoryId: category.id },
        { id: 3, name: 'Node.js', categoryId: category.id },
      ],
    });

    const oneSkill = await prisma.skill.findFirst({
      where: { name: 'JavaScript' },
    });

    await prisma.userHasSkill.create({
      data: {
        userId: userA.id,
        skillId: oneSkill!.id,
      },
    });

    const requesterA = buildAuthedRequester(userA);

    //ACT
    const response = await requesterA.delete(
      `/profiles/skills/${oneSkill!.id}`,
    );

    //ASSERT
    assert.strictEqual(response.status, 204);

    const deleted = await prisma.userHasSkill.findFirst({
      where: { userId: userA.id, skillId: oneSkill!.id },
    });
    assert.strictEqual(deleted, null, 'Skill should be deleted');
  });
  it('should return a 404 if skill does not exist for user', async () => {
    //ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);
    const userA = generateFakeUser({ roleId: roleId });
    await prisma.user.create({ data: userA });

    const category = await prisma.category.create({
      data: { name: 'Développement Web', slug: 'dev-web' },
    });

    await prisma.skill.createMany({
      data: [{ id: 1, name: 'JavaScript', categoryId: category.id }],
    });

    const oneSkill = await prisma.skill.findFirst({
      where: { name: 'JavaScript' },
    });

    const requesterA = buildAuthedRequester(userA);

    //ACT
    const response = await requesterA.delete(
      `/profiles/skills/${oneSkill!.id}`,
    );

    //ASSERT
    assert.strictEqual(response.status, 404);
    const data = response.data as ErrorResponse;
    assert.ok(data.error, 'Should have error message');
  });
});
describe('[POST] /profiles/availabilities', () => {
  it('should return a 201 when authentified user add new availabilities', async () => {
    //ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);
    const userA = generateFakeUser({ roleId: roleId });
    await prisma.user.create({ data: userA });
    await prisma.available.createMany({
      data: [
        { id: 1, day: 'Lundi', timeSlot: 'Morning' },
        { id: 2, day: 'Lundi', timeSlot: 'Afternoon' },
        { id: 3, day: 'Mardi', timeSlot: 'Morning' },
        { id: 4, day: 'Mardi', timeSlot: 'Afternoon' },
        { id: 5, day: 'Mercredi', timeSlot: 'Morning' },
        { id: 6, day: 'Mercredi', timeSlot: 'Afternoon' },
      ],
    });

    const requesterA = buildAuthedRequester(userA);
    //ACT
    const response = await requesterA.post(`/profiles/availabilities`, {
      day: 'Lundi',
      timeSlot: 'Morning',
    });

    //ASSERT
    assert.strictEqual(response.status, 201);
    const created = await prisma.userHasAvailable.findFirst({
      where: {
        userId: userA.id,
        available: { day: 'Lundi', timeSlot: 'Morning' },
      },
    });
    assert.ok(created, 'Availability should be created');
  });
  it('should return a 404 if the availabilities does not exist', async () => {
    //ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);
    const userA = generateFakeUser({ roleId: roleId });
    await prisma.user.create({ data: userA });
    await prisma.available.createMany({
      data: [
        { id: 1, day: 'Lundi', timeSlot: 'Morning' },
        { id: 2, day: 'Lundi', timeSlot: 'Afternoon' },
        { id: 3, day: 'Mardi', timeSlot: 'Morning' },
        { id: 4, day: 'Mardi', timeSlot: 'Afternoon' },
        { id: 5, day: 'Mercredi', timeSlot: 'Morning' },
        { id: 6, day: 'Mercredi', timeSlot: 'Afternoon' },
      ],
    });

    const requesterA = buildAuthedRequester(userA);
    //ACT
    const response = await requesterA.post(`/profiles/availabilities`, {
      day: 'Jeudi',
      timeSlot: 'Morning',
    });

    //ASSERT
    assert.strictEqual(response.status, 404);
    assert.ok((response.data as any).error, 'Should have error message');

    const notCreated = await prisma.userHasAvailable.findFirst({
      where: {
        userId: userA.id,
      },
    });
    assert.strictEqual(notCreated, null, 'No availability should be created');
  });
});
describe('[DELETE] /profiles/', () => {
  it('should delete account of the user', async () => {
    //ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);
    const userA = generateFakeUser({ roleId });
    const createdUser = await prisma.user.create({ data: userA });

    const category = await prisma.category.create({
      data: { name: 'Dev', slug: 'dev' },
    });

    const skill = await prisma.skill.create({
      data: { name: 'JavaScript', categoryId: category.id },
    });

    await prisma.userHasSkill.create({
      data: { userId: createdUser.id, skillId: skill.id },
    });

    await prisma.userHasInterest.create({
      data: { userId: createdUser.id, skillId: skill.id },
    });

    const available = await prisma.available.create({
      data: { day: 'Lundi', timeSlot: 'Morning' },
    });

    await prisma.userHasAvailable.create({
      data: { userId: createdUser.id, availableId: available.id },
    });

    const userB = await prisma.user.create({
      data: generateFakeUser({ roleId }),
    });

    await prisma.follow.create({
      data: { followerId: createdUser.id, followedId: userB.id },
    });

    await prisma.rating.create({
      data: {
        evaluatorId: createdUser.id,
        evaluatedId: userB.id,
        score: 5,
        comments: 'Great!',
      },
    });
    const conversation = await prisma.conversation.create({
      data: { title: 'Test conversation' },
    });

    await prisma.userHasConversation.create({
      data: {
        userId: createdUser.id,
        conversationId: conversation.id,
      },
    });

    await prisma.message.create({
      data: {
        senderId: createdUser.id,
        receiverId: userB.id,
        conversationId: conversation.id,
        content: 'Hello from userA',
      },
    });

    await prisma.message.create({
      data: {
        senderId: userB.id,
        receiverId: createdUser.id,
        conversationId: conversation.id,
        content: 'Hello from userB',
      },
    });

    await prisma.refreshToken.create({
      data: {
        userId: createdUser.id,
        token: 'fake-token',
        expireAt: new Date(Date.now() + 86400000),
      },
    });

    const requesterA = buildAuthedRequester(userA);
    //ACT
    const response = await requesterA.delete(`/profiles/`);
    //ASSERT
    const deletedUser = await prisma.user.findUnique({
      where: { id: createdUser.id },
    });
    assert.strictEqual(deletedUser, null, 'User should be deleted');

    const userSkills = await prisma.userHasSkill.findMany({
      where: { userId: createdUser.id },
    });
    assert.strictEqual(userSkills.length, 0, 'User skills should be deleted');

    const userInterests = await prisma.userHasInterest.findMany({
      where: { userId: createdUser.id },
    });
    assert.strictEqual(
      userInterests.length,
      0,
      'User interests should be deleted',
    );

    const userAvailabilities = await prisma.userHasAvailable.findMany({
      where: { userId: createdUser.id },
    });
    assert.strictEqual(
      userAvailabilities.length,
      0,
      'User availabilities should be deleted',
    );

    const userFollows = await prisma.follow.findMany({
      where: { followerId: createdUser.id },
    });
    assert.strictEqual(userFollows.length, 0, 'User follows should be deleted');

    const userRatings = await prisma.rating.findMany({
      where: { evaluatorId: createdUser.id },
    });
    assert.strictEqual(userRatings.length, 0, 'User ratings should be deleted');

    const userTokens = await prisma.refreshToken.findMany({
      where: { userId: createdUser.id },
    });
    assert.strictEqual(
      userTokens.length,
      0,
      'User refresh tokens should be deleted',
    );

    const userConversations = await prisma.userHasConversation.findMany({
      where: { userId: createdUser.id },
    });
    assert.strictEqual(
      userConversations.length,
      0,
      'User conversations should be deleted',
    );

    const sentMessages = await prisma.message.findMany({
      where: { senderId: createdUser.id },
    });
    assert.strictEqual(
      sentMessages.length,
      0,
      'Sent messages should be deleted',
    );

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: createdUser.id },
    });
    assert.strictEqual(
      receivedMessages.length,
      0,
      'Received messages should be deleted',
    );
    assert.strictEqual(response.status, 204);
  });
});
describe('[GET] /profiles/:id - Security & Data visibility', () => {
  it('should NOT return sensitive data when viewing another user profile', async () => {
    // ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const userA = await prisma.user.create({
      data: generateFakeUser({ roleId }),
    });

    const userB = await prisma.user.create({
      data: generateFakeUser({
        roleId,
        email: 'sensitive@email.com',
        age: 30,
        address: '123 Secret Street',
        postalCode: 12345,
        city: 'Paris',
      }),
    });

    const authedRequester = await buildAuthedRequester(userA);

    const response = await authedRequester.get(`/profiles/${userB.id}`);

    // ASSERT
    assert.strictEqual(response.status, 200);

    const profile = (response.data as ApiSuccess<any>).data;

    assert.strictEqual(
      profile.email,
      undefined,
      'Email should not be returned',
    );
    assert.strictEqual(profile.age, undefined, 'Age should not be returned');
    assert.strictEqual(
      profile.address,
      undefined,
      'Address should not be returned',
    );
    assert.strictEqual(
      profile.postalCode,
      undefined,
      'Postal code should not be returned',
    );

    assert.ok(profile.firstname, 'Firstname should be present');
    assert.ok(profile.lastname, 'Lastname should be present');
    assert.ok(profile.city, 'City should be present');
  });

  it('should return all data (including sensitive) when viewing own profile', async () => {
    // ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const user = await prisma.user.create({
      data: generateFakeUser({
        roleId,
        email: 'myemail@test.com',
        age: 25,
        address: '456 My Street',
        postalCode: 75001,
      }),
    });

    const authedRequester = await buildAuthedRequester(user);

    const response = await authedRequester.get(`/profiles/${user.id}`);

    // ASSERT
    assert.strictEqual(response.status, 200);
    const profile = (response.data as ApiSuccess<any>).data;

    assert.strictEqual(profile.email, 'myemail@test.com');
    assert.strictEqual(profile.age, 25);
    assert.strictEqual(profile.address, '456 My Street');
    assert.strictEqual(profile.postalCode, 75001);
  });
});
