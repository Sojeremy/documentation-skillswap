import axios from 'axios';
import { config } from '../../config.ts';
import { generateAccessToken } from '../lib/auth.ts';
import { io, type Socket } from 'socket.io-client';

//Exact type waited by generateAccessToken (déduit automatiquement, aucune duplication)
type TokenUser = Parameters<typeof generateAccessToken>[0];

// ======================================================
// Utils to make a fake user (JWT)
// ======================================================
let fakeUserId = 0;

export function generateFakeUser(
  overrides: Partial<TokenUser> = {},
): TokenUser {
  fakeUserId++;

  const now = new Date();

  return {
    id: fakeUserId,
    firstname: 'firstname',
    lastname: 'lastname',
    email: `user${fakeUserId}@oclock.io`,
    password: 'P4$$Mundo',

    // Prisma schema : roleId mandatory
    roleId: Number(process.env.TEST_ROLE_ID ?? 1),

    // optional (nullables)
    address: null,
    postalCode: null,
    city: null,
    age: null,
    avatarUrl: null,
    description: null,

    createdAt: now,
    updatedAt: now,

    ...overrides,
  };
}

// ======================================================
// SOCKET.IO — authenticated socket client
// ======================================================
export function buildAuthedSocket(user: TokenUser): Socket {
  const jwt = generateAccessToken(user);

  return io(`http://localhost:${config.port}`, {
    path: '/socket.io',
    transports: ['websocket'],

    // prevent hanging test process on failures
    reconnection: false,
    forceNew: true,

    extraHeaders: {
      Cookie: `accessToken=${jwt}`,
    },
  });
}

// ======================================================
// AXIOS — unauthenticated HTTP requests
// ======================================================
export const httpRequester = axios.create({
  baseURL: `http://localhost:${config.port}/api/v1`,
  validateStatus: () => true,
});

// ======================================================
// AXIOS — authenticated HTTP requests
// ======================================================
export function buildAuthedRequester(user: TokenUser) {
  const jwt = generateAccessToken(user);

  return axios.create({
    baseURL: `http://localhost:${config.port}/api/v1`,
    headers: {
      Cookie: `accessToken=${jwt}`,
    },
    validateStatus: () => true,
  });
}

// ======================================================
// Requesters ready to use
// ======================================================
export const memberRequester = buildAuthedRequester(generateFakeUser());

export const extractCookieValue = (cookieString: string): string => {
  return cookieString.split(';')[0].split('=')[1];
};
