import test from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../models/index.ts';
import { buildAuthedRequester, generateFakeUser } from '../test/index.ts';

type ApiSuccess<T> = { success: true; data: T; count: number };
type ApiError = { error: string };

type MessagePayload = {
  id: number;
  sender?: {
    id: number;
    firstname: string;
    lastname: string;
    avatarUrl?: string | null;
  };
  content: string;
  timestamp: string;
};

type MessagesListPayload = {
  messages: Array<{
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
  nextCursor: number | null;
};

test('POST /conversations/:id/messages => 201 when viewer is participant', async () => {
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
      title: 'Message Test',
      users: {
        create: [{ userId: createdA.id }, { userId: createdB.id }],
      },
    },
    select: { id: true },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.post<ApiSuccess<MessagePayload>>(
    `/conversations/${conversation.id}/messages`,
    { message: 'Hello from A' },
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 201);
  assert.equal(res.data.success, true);
  assert.equal(res.data.count, 1);

  assert.ok(res.data.data.id);
  assert.equal(res.data.data.content, 'Hello from A');
  assert.ok(typeof res.data.data.timestamp === 'string');

  assert.ok(res.data.data.sender);
  assert.equal(res.data.data.sender?.id, createdA.id);
});

test('POST /conversations/:id/messages => 404 when viewer is NOT a participant', async () => {
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
      title: 'Private Conv',
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
  const res = await requesterC.post<ApiError>(
    `/conversations/${conversation.id}/messages`,
    { message: 'Should not work' },
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 404);
  assert.match(res.data.error, /conversation not found|not found/i);
});

test('POST /conversations/:id/messages => 422 when message is empty', async () => {
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
      title: 'Validation Conv',
      users: {
        create: [{ userId: createdA.id }, { userId: createdB.id }],
      },
    },
    select: { id: true },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.post<ApiError>(
    `/conversations/${conversation.id}/messages`,
    { message: '' },
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 422);
  assert.match(res.data.error, /message/i);
});

test('GET /conversations/:id/messages => 200 returns paginated messages for participant', async () => {
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
      title: 'Messages Pagination',
      users: { create: [{ userId: createdA.id }, { userId: createdB.id }] },
    },
    select: { id: true },
  });

  const m1 = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: createdA.id,
      receiverId: createdB.id,
      content: 'm1',
      createdAt: new Date('2026-01-01T10:00:00.000Z'),
    },
    select: { id: true },
  });

  const m2 = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: createdB.id,
      receiverId: createdA.id,
      content: 'm2',
      createdAt: new Date('2026-01-01T10:01:00.000Z'),
    },
    select: { id: true },
  });

  const m3 = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: createdA.id,
      receiverId: createdB.id,
      content: 'm3',
      createdAt: new Date('2026-01-01T10:02:00.000Z'),
    },
    select: { id: true },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT (page 1)
  // =========================
  const res1 = await requesterA.get<ApiSuccess<MessagesListPayload>>(
    `/conversations/${conversation.id}/messages?limit=2`,
  );

  // =========================
  // ASSERT (page 1)
  // =========================
  assert.equal(res1.status, 200);
  assert.equal(res1.data.success, true);
  assert.equal(res1.data.count, 1);

  assert.ok(res1.data.data.messages);
  assert.equal(res1.data.data.messages.length, 2);

  const contents1 = res1.data.data.messages.map((m) => m.content);
  assert.ok(contents1.includes('m2') || contents1.includes('m3'));
  assert.ok(typeof res1.data.data.nextCursor === 'number');

  // =========================
  // ACT (page 2 - older)
  // =========================
  const cursor = res1.data.data.nextCursor!;
  const res2 = await requesterA.get<ApiSuccess<MessagesListPayload>>(
    `/conversations/${conversation.id}/messages?limit=10&cursor=${cursor}`,
  );

  // =========================
  // ASSERT (page 2)
  // =========================
  assert.equal(res2.status, 200);
  assert.equal(res2.data.success, true);

  const contents2 = res2.data.data.messages.map((m) => m.content);
  assert.ok(contents2.includes('m1'));
  assert.ok(
    res2.data.data.messages.every((m) => typeof m.timestamp === 'string'),
  );

  // ensure cursor logic: returned messages are older than cursor
  assert.ok(res2.data.data.messages.every((m) => m.id < cursor));

  // silence unused vars (ids can help debugging)
  assert.ok(m1.id && m2.id && m3.id);
});

test('GET /conversations/:id/messages => 404 when viewer is NOT a participant', async () => {
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
      title: 'Private Messages',
      users: { create: [{ userId: createdA.id }, { userId: createdB.id }] },
    },
    select: { id: true },
  });

  const requesterC = buildAuthedRequester(createdC);

  // =========================
  // ACT
  // =========================
  const res = await requesterC.get<ApiError>(
    `/conversations/${conversation.id}/messages?limit=10`,
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 404);
  assert.match(res.data.error, /not found/i);
});

test('GET /conversations/:id/messages => 422 when query params are invalid', async () => {
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
      title: 'Invalid Query',
      users: { create: [{ userId: createdA.id }, { userId: createdB.id }] },
    },
    select: { id: true },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.get<ApiError>(
    `/conversations/${conversation.id}/messages?limit=0&cursor=-5`,
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 422);
  assert.match(res.data.error, /too small/i);
});

test('PATCH /conversations/:id/message/:messageId => 200 when viewer is the sender (updates content)', async () => {
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
      title: 'Edit Message',
      users: {
        create: [{ userId: createdA.id }, { userId: createdB.id }],
      },
    },
    select: { id: true },
  });

  const createdMsg = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: createdA.id,
      receiverId: createdB.id,
      content: 'Original',
      createdAt: new Date('2026-01-01T10:00:00.000Z'),
    },
    select: { id: true },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.patch<ApiSuccess<MessagePayload>>(
    `/conversations/${conversation.id}/message/${createdMsg.id}`,
    { message: 'Edited' },
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 200);
  assert.equal(res.data.success, true);
  assert.equal(res.data.count, 1);

  assert.equal(res.data.data.id, createdMsg.id);
  assert.equal(res.data.data.content, 'Edited');
  assert.ok(typeof res.data.data.timestamp === 'string');
  assert.ok(res.data.data.sender);
  assert.equal(res.data.data.sender?.id, createdA.id);

  const dbMsg = await prisma.message.findUnique({
    where: { id: createdMsg.id },
    select: { content: true },
  });
  assert.equal(dbMsg?.content, 'Edited');
});

test('PATCH /conversations/:id/message/:messageId => 404 when viewer is NOT the sender', async () => {
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
      title: 'Edit Forbidden',
      users: {
        create: [{ userId: createdA.id }, { userId: createdB.id }],
      },
    },
    select: { id: true },
  });

  const createdMsg = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: createdA.id,
      receiverId: createdB.id,
      content: 'Original',
    },
    select: { id: true },
  });

  const requesterB = buildAuthedRequester(createdB);

  // =========================
  // ACT
  // =========================
  const res = await requesterB.patch<ApiError>(
    `/conversations/${conversation.id}/message/${createdMsg.id}`,
    { message: 'Hacked' },
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 404);
  assert.match(res.data.error, /message not found|not found/i);

  const dbMsg = await prisma.message.findUnique({
    where: { id: createdMsg.id },
    select: { content: true },
  });
  assert.equal(dbMsg?.content, 'Original');
});

test('PATCH /conversations/:id/message/:messageId => 404 when message does not exist', async () => {
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
      title: 'Missing Message',
      users: {
        create: [{ userId: createdA.id }, { userId: createdB.id }],
      },
    },
    select: { id: true },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.patch<ApiError>(
    `/conversations/${conversation.id}/message/999999`,
    { message: 'Edited' },
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 404);
  assert.match(res.data.error, /message not found|not found/i);
});

test('PATCH /conversations/:id/message/:messageId => 422 when body is invalid (empty message)', async () => {
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
      title: 'Edit Validation',
      users: {
        create: [{ userId: createdA.id }, { userId: createdB.id }],
      },
    },
    select: { id: true },
  });

  const createdMsg = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: createdA.id,
      receiverId: createdB.id,
      content: 'Original',
    },
    select: { id: true },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.patch<ApiError>(
    `/conversations/${conversation.id}/message/${createdMsg.id}`,
    { message: '' },
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 422);
  assert.ok(typeof res.data.error === 'string');
  assert.ok(res.data.error.length > 0);
});

test('DELETE /conversations/:id/message/:messageId => 404 when viewer is NOT the sender', async () => {
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
      title: 'Delete Forbidden',
      users: { create: [{ userId: createdA.id }, { userId: createdB.id }] },
    },
    select: { id: true },
  });

  const msg = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: createdA.id,
      receiverId: createdB.id,
      content: 'Should remain',
    },
    select: { id: true },
  });

  const requesterB = buildAuthedRequester(createdB);

  // =========================
  // ACT
  // =========================
  const res = await requesterB.delete<ApiError>(
    `/conversations/${conversation.id}/message/${msg.id}`,
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 404);
  assert.match(res.data.error, /message not found|not found/i);

  const stillThere = await prisma.message.findUnique({
    where: { id: msg.id },
    select: { id: true },
  });
  assert.ok(stillThere);
});

test('DELETE /conversations/:id/message/:messageId => 404 when message does not exist', async () => {
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
      title: 'Missing Message',
      users: { create: [{ userId: createdA.id }, { userId: createdB.id }] },
    },
    select: { id: true },
  });

  const requesterA = buildAuthedRequester(createdA);

  // =========================
  // ACT
  // =========================
  const res = await requesterA.delete<ApiError>(
    `/conversations/${conversation.id}/message/999999`,
  );

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 404);
  assert.match(res.data.error, /message not found|not found/i);
});

test('DELETE /conversations/:id/message/:messageId => 422 when params are invalid', async () => {
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
  const res = await requesterA.delete<ApiError>(`/conversations/0/message/-1`);

  // =========================
  // ASSERT
  // =========================
  assert.equal(res.status, 422);
  assert.ok(typeof res.data.error === 'string');
  assert.ok(res.data.error.length > 0);
});
