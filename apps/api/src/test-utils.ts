import { appRouter } from "./router";
import { createContext } from "./context";
import { getDb } from "@jemeka/db";
import { sessions } from "@jemeka/db";
import type { User } from "@jemeka/db";
import type { TrpcContext } from "./context";
import { migrate } from "drizzle-orm/libsql/migrator";
import path from "path";
import os from "os";

export async function setupTestDb() {
  const dbName = `test-${Math.random().toString(36).substring(7)}.db`;
  // Use an absolute path in the OS temp directory so the path is always valid
  // on any platform (Linux CI, macOS, Windows) without depending on cwd.
  const testDbPath = path.join(os.tmpdir(), dbName);
  const testDbUrl = `file:${testDbPath}`;

  const db = getDb(testDbUrl);
  
  // Run migrations
  const migrationsPath = path.resolve(__dirname, "../../../packages/db/src/migrations");
  await migrate(db, { 
    migrationsFolder: migrationsPath 
  });
  
  return db;
}

export async function createTestContext(user?: User): Promise<TrpcContext> {
  const req = new Request("http://localhost:4000/api/trpc");
  
  if (user) {
    const db = getDb();
    const token = "test-token-" + Math.random().toString(36).substring(7);
    await db.insert(sessions).values({
      sessionToken: token,
      userId: user.id,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    req.headers.set("cookie", `authjs.session-token=${token}`);
  }

  const baseCtx = await createContext({ 
    req, 
    resHeaders: new Headers(),
    info: {} as any
  });
  return { ...baseCtx, user };
}

export async function createAuthenticatedTestCaller(user: User) {
  const ctx = await createTestContext(user);
  return appRouter.createCaller(ctx);
}

export async function createTestCaller() {
  const ctx = await createTestContext();
  return appRouter.createCaller(ctx);
}
