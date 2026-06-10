import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import path from "path";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

export function getDb(url?: string) {
  if (!instance || url) {
    const dbUrl = url || process.env.DATABASE_URL || "file:sqlite.db";
    const client = createClient({ url: dbUrl });
    instance = drizzle(client, { schema: fullSchema });
  }
  return instance;
}
