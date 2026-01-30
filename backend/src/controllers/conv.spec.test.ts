import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../models/index.ts';
import { buildAuthedRequester, generateFakeUser } from '../test/index.ts';

type ApiSuccess<T> = { success: true; data: T; count: number };
type ApiError = { error: string };

type CreateConversationPayload = {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  participant?: {
    id: number;
    firstname: string;
    lastname: string;
    avatarUrl?: string | null;
    isFollowing: boolean;
    isRated: boolean;
  };
};

type ConversationByIdPayload = {
  id: number;
  participant?: {
    id: number;
    firstname: string;
    lastname: string;
    avatarUrl?: string | null;
    isFollowing: boolean;
    isRated: boolean;
  };
  title: string;
  status: 'Open' | 'Close';
  messages?: Array<{
    id: number;
    sender?: {
      id: number;
      firstname: string;
      lastname: string;
      avatarUrl?: string | null;
    };
    content: string;
    timestamp: string;
  }>;
};

type CloseConversationPayload = {
  closed: boolean;
};

test('POST /conversations => 201 when viewer follows receiver', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const userB = generateFakeUser({ roleId });

  const createdA = await prisma.user.create({ data: userA });
  const createdB = await prisma.user.create({ data: userB });

  await prisma.follow.create({
    data: { followerId: createdA.id, followedId: createdB.id },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.post<ApiSuccess<CreateConversationPayload>>(
    '/conversations',
    {
      title: 'New Conversation',
      receiverId: createdB.id,
    },
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 201);
  assert.equal(res.data.success, true);
  assert.equal(res.data.count, 1);

  assert.ok(res.data.data.id);
  assert.equal(res.data.data.title, 'New Conversation');

  if (res.data.data.participant) {
    assert.equal(res.data.data.participant.id, createdB.id);
    assert.equal(res.data.data.participant.isFollowing, true);
  }
});

test('POST /conversations => 201 and increments title when creating same title with same user twice', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const userB = generateFakeUser({ roleId });

  const createdA = await prisma.user.create({ data: userA });
  const createdB = await prisma.user.create({ data: userB });

  await prisma.follow.create({
    data: { followerId: createdA.id, followedId: createdB.id },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const first = await requesterA.post<ApiSuccess<CreateConversationPayload>>(
    '/conversations',
    { title: 'New Conversation', receiverId: createdB.id },
  );

  const second = await requesterA.post<ApiSuccess<CreateConversationPayload>>(
    '/conversations',
    { title: 'New Conversation', receiverId: createdB.id },
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(first.status, 201);
  assert.equal(second.status, 201);

  assert.ok(first.data.data.id);
  assert.ok(second.data.data.id);
  assert.notEqual(first.data.data.id, second.data.data.id);

  assert.equal(first.data.data.title, 'New Conversation');
  assert.equal(second.data.data.title, 'New Conversation (2)');
});

test('POST /conversations => 403 when viewer does NOT follow receiver', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const userB = generateFakeUser({ roleId });

  const createdA = await prisma.user.create({ data: userA });
  const createdB = await prisma.user.create({ data: userB });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.post<ApiError>('/conversations', {
    title: 'New Conversation',
    receiverId: createdB.id,
  });

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 403);
  assert.match(res.data.error, /follow/i);
});

test('GET /conversations/:id => 200 when viewer is a participant (returns participant + messages)', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const userB = generateFakeUser({ roleId });

  const createdA = await prisma.user.create({ data: userA });
  const createdB = await prisma.user.create({ data: userB });

  await prisma.follow.create({
    data: { followerId: createdA.id, followedId: createdB.id },
  });

  const conversation = await prisma.conversation.create({
    data: {
      title: 'Existing Conversation',
      users: {
        create: [{ userId: createdA.id }, { userId: createdB.id }],
      },
    },
    select: { id: true },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: createdA.id,
      receiverId: createdB.id,
      content: 'Hello',
      createdAt: new Date('2026-01-01T10:00:00.000Z'),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: createdB.id,
      receiverId: createdA.id,
      content: 'Hi back',
      createdAt: new Date('2026-01-01T10:01:00.000Z'),
    },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.get<ApiSuccess<ConversationByIdPayload>>(
    `/conversations/${conversation.id}`,
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 200);
  assert.equal(res.data.success, true);
  assert.equal(res.data.count, 1);

  assert.equal(res.data.data.id, conversation.id);
  assert.equal(res.data.data.title, 'Existing Conversation');
  assert.equal(res.data.data.status, 'Open');

  assert.ok(res.data.data.participant);
  assert.equal(res.data.data.participant?.id, createdB.id);
  assert.equal(res.data.data.participant?.isFollowing, true);

  assert.ok(res.data.data.messages);
  assert.equal(res.data.data.messages?.length, 2);

  const contents = res.data.data.messages?.map((m) => m.content) ?? [];
  assert.ok(contents.includes('Hello'));
  assert.ok(contents.includes('Hi back'));

  const timestamps = res.data.data.messages?.map((m) => m.timestamp) ?? [];
  assert.ok(timestamps.every((t) => typeof t === 'string'));
});

test('DELETE /conversations/:id => 204 removes viewer from conversation and keeps messages', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const userB = generateFakeUser({ roleId });

  const createdA = await prisma.user.create({ data: userA });
  const createdB = await prisma.user.create({ data: userB });

  const conversation = await prisma.conversation.create({
    data: {
      title: 'Leave Conversation',
      users: {
        create: [{ userId: createdA.id }, { userId: createdB.id }],
      },
    },
    select: { id: true },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: createdA.id,
      receiverId: createdB.id,
      content: 'Message stays',
    },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.delete<ApiError>(
    `/conversations/${conversation.id}`,
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 204);

  const membershipA = await prisma.userHasConversation.findUnique({
    where: {
      userId_conversationId: {
        userId: createdA.id,
        conversationId: conversation.id,
      },
    },
    select: { userId: true },
  });
  assert.equal(membershipA, null);

  const membershipB = await prisma.userHasConversation.findUnique({
    where: {
      userId_conversationId: {
        userId: createdB.id,
        conversationId: conversation.id,
      },
    },
    select: { userId: true },
  });
  assert.ok(membershipB);

  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    select: { id: true },
  });
  assert.equal(messages.length, 1);
});

test('GET /conversations/:id => 404 when viewer is NOT a participant', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const userB = generateFakeUser({ roleId });
  const userC = generateFakeUser({ roleId });

  const createdA = await prisma.user.create({ data: userA });
  const createdB = await prisma.user.create({ data: userB });
  const createdC = await prisma.user.create({ data: userC });

  const conversation = await prisma.conversation.create({
    data: {
      title: 'Private Conversation',
      users: {
        create: [{ userId: createdA.id }, { userId: createdB.id }],
      },
    },
    select: { id: true },
  });

  const requesterC = buildAuthedRequester(createdC);

  // =========================
  // ACT
  // =========================
  const res = await requesterC.get<ApiError>(
    `/conversations/${conversation.id}`,
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 404);
  assert.match(res.data.error, /not found/i);
});

test('GET /conversations/:id => 404 when conversation does not exist', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const createdA = await prisma.user.create({ data: userA });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.get<ApiError>('/conversations/999999');

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 404);
  assert.match(res.data.error, /not found/i);
});

test('DELETE /conversations/:id => 404 when viewer is NOT a participant', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const userB = generateFakeUser({ roleId });
  const userC = generateFakeUser({ roleId });

  const createdA = await prisma.user.create({ data: userA });
  const createdB = await prisma.user.create({ data: userB });
  const createdC = await prisma.user.create({ data: userC });

  const conversation = await prisma.conversation.create({
    data: {
      title: 'Private Conversation 2',
      users: {
        create: [{ userId: createdA.id }, { userId: createdB.id }],
      },
    },
    select: { id: true },
  });

  const requesterC = buildAuthedRequester(createdC);

  // =========================
  // ACT
  // =========================
  const res = await requesterC.delete<ApiError>(
    `/conversations/${conversation.id}`,
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 404);
  assert.match(res.data.error, /not found/i);
});

test('PATCH /conversations/:id/close => 200 when viewer is a participant (closes conversation)', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const userB = generateFakeUser({ roleId });

  const createdA = await prisma.user.create({ data: userA });
  const createdB = await prisma.user.create({ data: userB });

  const conversation = await prisma.conversation.create({
    data: {
      title: 'Close Me',
      status: 'Open',
      users: { create: [{ userId: createdA.id }, { userId: createdB.id }] },
    },
    select: { id: true },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.patch<ApiSuccess<CloseConversationPayload>>(
    `/conversations/${conversation.id}/close`,
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 200);
  assert.equal(res.data.success, true);
  assert.equal(res.data.count, 1);

  assert.equal(res.data.data.closed, true);

  const dbConv = await prisma.conversation.findUnique({
    where: { id: conversation.id },
    select: { status: true },
  });

  assert.equal(dbConv?.status, 'Close');
});

test('PATCH /conversations/:id/close => 200 and closed=false when already closed', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const userB = generateFakeUser({ roleId });

  const createdA = await prisma.user.create({ data: userA });
  const createdB = await prisma.user.create({ data: userB });

  const conversation = await prisma.conversation.create({
    data: {
      title: 'Already Closed',
      status: 'Close',
      users: { create: [{ userId: createdA.id }, { userId: createdB.id }] },
    },
    select: { id: true },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.patch<ApiSuccess<CloseConversationPayload>>(
    `/conversations/${conversation.id}/close`,
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 200);
  assert.equal(res.data.success, true);
  assert.equal(res.data.count, 1);

  assert.equal(res.data.data.closed, false);

  const dbConv = await prisma.conversation.findUnique({
    where: { id: conversation.id },
    select: { status: true },
  });

  assert.equal(dbConv?.status, 'Close');
});

test('PATCH /conversations/:id/close => 404 when viewer is NOT a participant', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const userB = generateFakeUser({ roleId });
  const userC = generateFakeUser({ roleId });

  const createdA = await prisma.user.create({ data: userA });
  const createdB = await prisma.user.create({ data: userB });
  const createdC = await prisma.user.create({ data: userC });

  const conversation = await prisma.conversation.create({
    data: {
      title: 'Private Conversation',
      status: 'Open',
      users: { create: [{ userId: createdA.id }, { userId: createdB.id }] },
    },
    select: { id: true },
  });

  const requesterC = buildAuthedRequester(createdC);

  // =========================
  // ACT
  // =========================
  const res = await requesterC.patch<ApiError>(
    `/conversations/${conversation.id}/close`,
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 404);
  assert.match(res.data.error, /not found/i);
});

test('PATCH /conversations/:id/close => 404 when conversation does not exist', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const createdA = await prisma.user.create({ data: userA });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.patch<ApiError>(`/conversations/999999/close`);

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 404);
  assert.match(res.data.error, /not found/i);
});

test('PATCH /conversations/:id/close => 422 when params are invalid', async () => {
  // =========================
  // ARRANGE
  // =========================
  const roleId = Number(process.env.TEST_ROLE_ID);

  const userA = generateFakeUser({ roleId });
  const createdA = await prisma.user.create({ data: userA });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.patch<ApiError>(`/conversations/0/close`);

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 422);
  assert.ok(typeof res.data.error === 'string');
  assert.ok(res.data.error.length > 0);
});
