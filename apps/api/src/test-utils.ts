import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./router";
import { appRouter } from "./router";
import { createContext } from "./context";
import { getDb } from "@jemeka/db";
import { migrate } from "drizzle-orm/libsql/migrator";
import path from "path";
import fs from "fs";

export async function setupTestDb() {
  const testDbUrl = "file:test.db";
  // Delete existing test db if it exists
  if (fs.existsSync("test.db")) {
    fs.unlinkSync("test.db");
  }
  
  const db = getDb(testDbUrl);
  
  // Run migrations
  const migrationsPath = path.resolve(__dirname, "../../../packages/db/src/migrations");
  await migrate(db, { 
    migrationsFolder: migrationsPath 
  });
  
  return db;
}

export function createTestContext() {
  const req = new Request("http://localhost:4000/api/trpc");
  return createContext({ req, resHeaders: new Headers() });
}

export const testCaller = appRouter.createCaller(createTestContext());
