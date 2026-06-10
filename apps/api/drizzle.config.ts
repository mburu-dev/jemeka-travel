import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import path from "path";

export default defineConfig({
  schema: "../../packages/db/src/schema.ts",
  out: "../../packages/db/src/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:sqlite.db",
  },
});
