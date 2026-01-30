import test from 'node:test';
import assert from 'node:assert/strict';
import { io } from 'socket.io-client';

import { prisma } from '../models/index.ts';
import { config } from '../../config.ts';
import { buildAuthedSocket, generateFakeUser } from '../test/index.ts';

type SocketErrorPayload = {
  code: 'FORBIDDEN' | 'VALIDATION';
  message: string;
};

function withTimeout<T>(promise: Promise<T>, ms = 2000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
    promise.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (e) => {
        clearTimeout(id);
        reject(e);
      },
    );
  });
}

function waitForConnect(socket: ReturnType<typeof buildAuthedSocket>) {
  return withTimeout(
    new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        socket.off('connect', onConnect);
        socket.off('connect_error', onErr);
      };

      const onConnect = () => {
        cleanup();
        resolve();
      };

      const onErr = (err: unknown) => {
        cleanup();
        reject(err);
      };

      if (socket.connected) return resolve();

      socket.once('connect', onConnect);
      socket.once('connect_error', onErr);
    }),
    2000,
  );
}

function once<T>(socket: any, event: string) {
  return withTimeout(
    new Promise<T>((resolve, reject) => {
      const cleanup = () => {
        socket.off(event, onEvent);
        socket.off('connect_error', onErr);
        socket.off('disconnect', onDisc);
      };

      const onEvent = (payload: T) => {
        cleanup();
        resolve(payload);
      };

      const onErr = (err: unknown) => {
        cleanup();
        reject(err);
      };

      const onDisc = (reason: unknown) => {
        cleanup();
        reject(new Error(`Socket disconnected: ${String(reason)}`));
      };

      socket.once(event, onEvent);
      socket.once('connect_error', onErr);
      socket.once('disconnect', onDisc);
    }),
    2500,
  );
}

function disconnect(socket: any) {
  socket.removeAllListeners();
  socket.disconnect();
}

test('Socket.IO => connects with valid JWT cookie', async () => {
  // ARRANGE
  const roleId = Number(process.env.TEST_ROLE_ID);
  const createdA = await prisma.user.create({
    data: generateFakeUser({ roleId }),
  });
  // ACT & ASSERT
  const socket = buildAuthedSocket(createdA);
  try {
    await waitForConnect(socket);
    assert.ok(true);
  } finally {
    disconnect(socket);
  }
});

test('Socket.IO => connect_error when no JWT cookie', async () => {
  // ARRANGE & ACT & ASSERT
  const socket = io(`http://localhost:${config.port}`, {
    path: '/socket.io',
    transports: ['websocket'],
    reconnection: false,
    forceNew: true,
  });

  try {
    await withTimeout(
      new Promise<void>((resolve, reject) => {
        socket.once('connect', () => reject(new Error('Should not connect')));
        socket.once('connect_error', () => resolve());
      }),
      2000,
    );
    assert.ok(true);
  } finally {
    disconnect(socket);
  }
});

test('Socket.IO => conversation:join succeeds when user is participant', async () => {
  // ARRANGE
  const roleId = Number(process.env.TEST_ROLE_ID);

  const createdA = await prisma.user.create({
    data: generateFakeUser({ roleId }),
  });
  const createdB = await prisma.user.create({
    data: generateFakeUser({ roleId }),
  });

  // ACT & ASSERT
  const conv = await prisma.conversation.create({
    data: {
      title: 'Socket Join OK',
      users: { create: [{ userId: createdA.id }, { userId: createdB.id }] },
    },
    select: { id: true },
  });

  const socket = buildAuthedSocket(createdA);

  try {
    await waitForConnect(socket);

    socket.emit('conversation:join', { conversationId: conv.id });

    const payload = await once<{ conversationId: number }>(
      socket,
      'conversation:joined',
    );

    assert.equal(payload.conversationId, conv.id);
  } finally {
    disconnect(socket);
  }
});

test('Socket.IO => conversation:join emits FORBIDDEN error when user is NOT participant', async () => {
  // ARRANGE
  const roleId = Number(process.env.TEST_ROLE_ID);

  // ACT & ASSERT
  const createdA = await prisma.user.create({
    data: generateFakeUser({ roleId }),
  });
  const createdB = await prisma.user.create({
    data: generateFakeUser({ roleId }),
  });
  const createdC = await prisma.user.create({
    data: generateFakeUser({ roleId }),
  });

  const conv = await prisma.conversation.create({
    data: {
      title: 'Socket Join Forbidden',
      users: { create: [{ userId: createdA.id }, { userId: createdB.id }] },
    },
    select: { id: true },
  });

  const socket = buildAuthedSocket(createdC);

  try {
    await waitForConnect(socket);

    socket.emit('conversation:join', { conversationId: conv.id });

    const err = await once<SocketErrorPayload>(socket, 'error');
    assert.equal(err.code, 'FORBIDDEN');
  } finally {
    disconnect(socket);
  }
});
