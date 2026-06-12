import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({ url: "file:../api/sqlite.db" });
  try {
    await client.execute("ALTER TABLE bookings ADD COLUMN transaction_id TEXT;");
    console.log("Column added successfully!");
  } catch (e) {
    console.error("Error adding column:", e);
  }
}
main();
