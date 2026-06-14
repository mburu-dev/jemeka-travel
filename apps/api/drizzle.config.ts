import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import path from "path";

export default defineConfig({
  schema: "../../packages/db/src/schema.ts",
  out: "../../packages/db/src/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL || "file:sqlite.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
