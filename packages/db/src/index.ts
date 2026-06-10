import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import * as relations from "./relations";

const fullSchema = { ...schema, ...relations };

let instance: any;

export function getDb(url?: string) {
  if (!instance || url) {
    const dbUrl = url || process.env.DATABASE_URL || "file:sqlite.db";
    const client = createClient({ url: dbUrl });
    instance = drizzle(client, { schema: fullSchema });
  }
  return instance;
}

export * from "./schema";
export * from "./relations";
