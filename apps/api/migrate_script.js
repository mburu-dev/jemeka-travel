import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

async function run() {
  const client = createClient({
    url: "file:./sqlite.db",
  });

  try {
    console.log("Adding new columns to destinations...");
    await client.execute("ALTER TABLE destinations ADD COLUMN experience_categories text");
    await client.execute("ALTER TABLE destinations ADD COLUMN wildlife text");
    await client.execute("ALTER TABLE destinations ADD COLUMN duration_recommendations text");
    await client.execute("ALTER TABLE destinations ADD COLUMN video_experience_url text");
    await client.execute("ALTER TABLE destinations ADD COLUMN destination_testimonials text");
    console.log("Successfully altered destinations table.");
  } catch (error) {
    console.error("Migration failed:", error.message);
  }
}

run();
