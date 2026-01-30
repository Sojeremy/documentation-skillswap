import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { after, before, beforeEach, type TestContext } from 'node:test';
import type { Server } from 'node:http';
import http from 'node:http';
import type { Server as SocketIOServer } from 'socket.io';
import { initSocket } from '../../realtime/socket.ts';
import { prisma } from '../../models/index.ts';
import { app } from '../../app.ts';
import { setupMembersIndex, membersIndex } from '../../lib/mailisearch.ts';

let server: Server | undefined;
let io: SocketIOServer | undefined;

function docker(args: string[], stdio: 'inherit' | 'ignore' = 'inherit') {
  return execFileSync('docker', args, { stdio });
}

async function waitForDb(timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('[TEST] prisma connected');
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error('Database not ready on time (localhost:5437)');
}

async function waitForMeilisearch(timeoutMs = 20000) {
  const start = Date.now();
  const meiliHost = process.env.MEILISEARCH_HOST || 'http://localhost:7701';
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${meiliHost}/health`);
      if (res.ok) {
        console.log('[TEST] Meilisearch connected');
        return;
      }
    } catch {
      // Meilisearch not ready yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('Meilisearch not ready on time (localhost:7701)');
}

/**
 * Prisma CLI cross-platform
 */
function runPrisma(args: string[]) {
  const prismaCliJs = resolve(
    process.cwd(),
    'node_modules',
    'prisma',
    'build',
    'index.js',
  );
  execFileSync(process.execPath, [prismaCliJs, ...args], { stdio: 'inherit' });
}

before(async () => {
  // 1) Remove containers if they exist
  try {
    execFileSync('docker', ['rm', '-f', 'skillswaptest'], { stdio: 'ignore' });
  } catch {
    // ignore: container didn't exist
  }
  try {
    execFileSync('docker', ['rm', '-f', 'skillswaptest-meili'], {
      stdio: 'ignore',
    });
  } catch {
    // ignore: container didn't exist
  }

  // 2) Start test Postgres (use a real tag)
  docker(
    [
      'run',
      '-d',
      '--name',
      'skillswaptest',
      '-p',
      '5437:5432',
      '-e',
      'POSTGRES_USER=skillswaptest',
      '-e',
      'POSTGRES_PASSWORD=skillswaptest',
      '-e',
      'POSTGRES_DB=skillswaptest',
      'postgres:16',
    ],
    'inherit',
  );

  // 3) Start test Meilisearch
  docker(
    [
      'run',
      '-d',
      '--name',
      'skillswaptest-meili',
      '-p',
      '7701:7700',
      '-e',
      'MEILI_MASTER_KEY=testmasterkey123',
      '-e',
      'MEILI_ENV=development',
      'getmeili/meilisearch:v1.6',
    ],
    'inherit',
  );

  // 4) Wait for Postgres and Meilisearch to be ready
  await Promise.all([waitForDb(), waitForMeilisearch()]);
  console.log('[TEST] DATABASE_URL =', process.env.DATABASE_URL);

  // 5) Apply migrations to the test DB (DATABASE_URL comes from --env-file)
  runPrisma(['migrate', 'deploy']);

  // 6) Setup Meilisearch index
  await setupMembersIndex();
  console.log('[TEST] Meilisearch index configured');

  // 7) Seed minimal required data for your schema/tests
  // Ensure Role 'Membre' exists AND keep its id available to tests/helpers.
  // Note: Role.name is an enum (RoleOfUser), Prisma accepts "Membre".
  const ensuredRole = await prisma.role.upsert({
    where: { id: 1 }, // safe upsert anchor; if id=1 doesn't exist, it will create it
    update: { name: 'Membre' },
    create: { name: 'Membre' },
    select: { id: true },
  });

  process.env.TEST_ROLE_ID = String(ensuredRole.id);

  // 6) Start the test server on the test port
  server = http.createServer(app);
  io = initSocket(server);
  server.listen(Number(process.env.PORT)); // ex: 7357
});

beforeEach(async (t) => {
  // Silence some logs during tests
  (t as TestContext).mock.method(console, 'info', () => {});

  // Reset DB and Meilisearch between tests
  await Promise.all([truncateTables(), membersIndex.deleteAllDocuments()]);

  // Re-seed minimal required data after truncate (Role is required by User.roleId)
  const role = await prisma.role.create({
    data: { name: 'Membre' },
    select: { id: true },
  });

  process.env.TEST_ROLE_ID = String(role.id);
});

after(async () => {
  await prisma.$disconnect();

  // Remove test containers
  try {
    execFileSync('docker', ['rm', '-f', 'skillswaptest'], { stdio: 'ignore' });
  } catch {
    // ignore: container didn't exist
  }
  try {
    execFileSync('docker', ['rm', '-f', 'skillswaptest-meili'], {
      stdio: 'ignore',
    });
  } catch {
    // ignore: container didn't exist
  }

  // Close socket.io FIRST (important)
  if (io) {
    await new Promise<void>((resolve) => io!.close(() => resolve()));
  }

  // Close HTTP server after
  if (server) {
    await new Promise<void>((resolve) => server!.close(() => resolve()));
  }
});

async function truncateTables() {
  await prisma.$executeRawUnsafe(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" RESTART IDENTITY CASCADE';
      END LOOP;
    END $$;
  `);
}
