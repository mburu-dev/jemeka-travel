import { getDb } from "@jemeka/db";
import { migrate } from "drizzle-orm/libsql/migrator";
import path from "path";

async function testMemory() {
  try {
    const testDbUrl = ":memory:";
    const db = getDb(testDbUrl);
    
    const migrationsPath = path.resolve("../../packages/db/src/migrations");
    console.log("Running migrations on memory DB...", migrationsPath);
    await migrate(db, { migrationsFolder: migrationsPath });
    console.log("Migrations successful!");
    
    // try to query something
    const res = await db.query.users.findMany();
    console.log("Users:", res);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

testMemory();
