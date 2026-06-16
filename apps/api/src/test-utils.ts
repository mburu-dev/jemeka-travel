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
  const testDbUrl = `file:${dbName}?mode=memory&cache=shared`;

  const db = getDb(testDbUrl);
  
  // Run migrations
  const migrationsPath = path.resolve(__dirname, "../../../packages/db/src/migrations");
  console.log("MIGRATION PATH RESOLVED AS:", migrationsPath);
  await migrate(db, { 
    migrationsFolder: migrationsPath 
  });
  
  return { db, url: testDbUrl };
}

export async function createTestContext(user?: User, db?: ReturnType<typeof getDb>): Promise<TrpcContext> {
  const req = new Request("http://localhost:4000/api/trpc");
  
  if (user) {
    const dbToUse = db || getDb();
    const token = "test-token-" + Math.random().toString(36).substring(7);
    await dbToUse.insert(sessions).values({
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
  return { ...baseCtx, user, db };
}

export async function createAuthenticatedTestCaller(user: User, db?: ReturnType<typeof getDb>) {
  const ctx = await createTestContext(user, db);
  return appRouter.createCaller(ctx);
}

export async function createTestCaller(db?: ReturnType<typeof getDb>) {
  const ctx = await createTestContext(undefined, db);
  return appRouter.createCaller(ctx);
}
