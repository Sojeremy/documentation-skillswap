import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  extractCookieValue,
  generateFakeUser,
  httpRequester,
} from '../test/index.ts';
import { prisma } from '../models/index.ts';
import argon2 from 'argon2';

describe('[POST] /auth/register', () => {
  it('should return a 201 status when user is registered successfully', async () => {
    //ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const userA = generateFakeUser({ roleId: roleId });
    const body = {
      firstname: userA.firstname,
      lastname: userA.lastname,
      email: userA.email,
      password: userA.password,
      confirmation: userA.password,
    };

    //ACT
    const response = await httpRequester.post('/auth/register', body);
    //ASSERT
    assert.equal(response.status, 201);
    assert.strictEqual(userA!.firstname, body.firstname);
    assert.strictEqual(userA!.lastname, body.lastname);
    assert.strictEqual(userA!.email, body.email);
  });
  it('should return access token and refresh token when register is success', async () => {
    //ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const userA = generateFakeUser({ roleId: roleId });
    const body = {
      firstname: userA.firstname,
      lastname: userA.lastname,
      email: userA.email,
      password: userA.password,
      confirmation: userA.password,
    };

    //ACT
    const response = await httpRequester.post('/auth/register', body);

    const cookie = response.headers['set-cookie'];

    const accessToken = cookie.find((c: string) =>
      c.startsWith('accessToken='),
    );
    const refreshToken = cookie.find((c: string) =>
      c.startsWith('refreshToken='),
    );
    //ASSERT
    assert.equal(response.status, 201);
    assert.ok(accessToken, 'accessToken cookie not found');
    assert.ok(refreshToken, 'refreshToken cookie not found');
  });
  it('should return a 409 status when trying to register an existing user', async () => {
    // ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const userA = generateFakeUser({ roleId: roleId });

    await prisma.user.create({ data: userA });

    const body = {
      firstname: userA.firstname,
      lastname: userA.lastname,
      email: userA.email,
      password: userA.password,
      confirmation: userA.password,
    };
    // ACT
    const response = await httpRequester.post('/auth/register', body);

    // ASSERT
    assert.strictEqual(response.status, 409);
  });
});
describe('[POST] /auth/login', () => {
  it('should return a 200 status when login is successful', async () => {
    // ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const plainPassword = 'P4$$Mundo';

    const userA = generateFakeUser({
      roleId: roleId,
      password: plainPassword,
    });

    await prisma.user.create({
      data: {
        ...userA,
        password: await argon2.hash(plainPassword),
      },
    });

    const body = {
      email: userA.email,
      password: 'P4$$Mundo',
    };
    // ACT
    const response = await httpRequester.post('/auth/login', body);

    const cookie = response.headers['set-cookie'];

    const accessToken = cookie.find((c: string) =>
      c.startsWith('accessToken='),
    );
    const refreshToken = cookie.find((c: string) =>
      c.startsWith('refreshToken='),
    );

    // ASSERT
    assert.strictEqual(response.status, 200);
    assert.ok(accessToken, 'accessToken cookie not found');
    assert.ok(refreshToken, 'refreshToken cookie not found');
  });
  it('should return a 401 status when login fails due to incorrect mail or password', async () => {
    // ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const plainPassword = 'P4$$Mundo';

    const userA = generateFakeUser({
      roleId: roleId,
      password: plainPassword,
    });

    await prisma.user.create({
      data: {
        ...userA,
        password: await argon2.hash(plainPassword),
      },
    });

    const body = {
      email: userA.email,
      password: 'bigfakepassword',
    };
    // ACT
    const response = await httpRequester.post('/auth/login', body);

    // ASSERT
    assert.strictEqual(response.status, 401);
  });
  it('should return a 401 status if the user not exist', async () => {
    // ARRANGE

    const body = {
      email: 'falemai@fake.com',
      password: 'bigfakepassword',
    };
    // ACT
    const response = await httpRequester.post('/auth/login', body);

    // ASSERT
    assert.strictEqual(response.status, 401);
  });
});
describe('[POST] /auth/refresh', () => {
  it('should return a 200 status with new accessToken when refreshToken is valid', async () => {
    // ARRANGE
    const roleId = Number(process.env.TEST_ROLE_ID);

    const plainPassword = 'P4$$Mundo';

    const userA = generateFakeUser({
      roleId: roleId,
      password: plainPassword,
    });

    await prisma.user.create({
      data: {
        ...userA,
        password: await argon2.hash(plainPassword),
      },
    });

    const body = {
      email: userA.email,
      password: 'P4$$Mundo',
    };
    // ACT
    const loginResponse = await httpRequester.post('/auth/login', body);
    const oldRefreshTokenFull = loginResponse.headers['set-cookie'].find(
      (c: string) => c.startsWith('refreshToken='),
    );

    const oldRefreshToken = extractCookieValue(oldRefreshTokenFull);

    const oldAccessTokenFull = loginResponse.headers['set-cookie'].find(
      (c: string) => c.startsWith('accessToken='),
    );
    const oldAccessToken = extractCookieValue(oldAccessTokenFull);

    const refreshResponse = await httpRequester.post(
      '/auth/refresh',
      {},
      {
        headers: {
          Cookie: `accessToken=${oldAccessToken}; refreshToken=${oldRefreshToken}`,
        },
      },
    );

    const cookie = refreshResponse.headers['set-cookie'];

    const newAccessToken = cookie.find((c: string) =>
      c.startsWith('accessToken='),
    );
    const newRefreshToken = cookie.find((c: string) =>
      c.startsWith('refreshToken='),
    );

    //ASSERT

    assert.strictEqual(loginResponse.status, 200);
    assert.strictEqual(refreshResponse.status, 200);
    assert.ok(newAccessToken !== oldAccessToken);
    assert.ok(newAccessToken, 'accessToken cookie not found');
    assert.ok(newRefreshToken, 'refreshToken cookie not found');
  });
  it('should return a 401 status when refresh token is missing', async () => {
    // ACT

    const refreshResponse = await httpRequester.post('/auth/refresh');

    //ASSERT

    assert.strictEqual(refreshResponse.status, 401);
  });
});
