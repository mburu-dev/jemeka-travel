import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import * as relations from "./relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle> | undefined;

export function getDb(url?: string, authToken?: string) {
  // When an explicit URL is provided (e.g. in tests), always create a fresh
  // client — never return the production singleton for a different database.
  if (url) {
    const client = createClient({
      url,
      ...(authToken ? { authToken } : {}),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return drizzle(client as any, { schema: fullSchema });
  }

  if (!instance) {
    // Cloudflare worker fallback for process.env
    const _processEnv = typeof process !== "undefined" && process.env ? (process.env as any) : {};
    
    const dbUrl = _processEnv.DATABASE_URL || "file:sqlite.db";
    const token = authToken || _processEnv.DATABASE_AUTH_TOKEN;
    
    const client = createClient({ 
      url: dbUrl,
      ...(token ? { authToken: token } : {})
    });
    // Type cast required: @libsql/client@0.17 and drizzle-orm@0.45 ship slightly
    // different Client type definitions from @libsql/core. Runtime behaviour is
    // identical — drizzle uses the same WebSocket/HTTP protocol under the hood.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instance = drizzle(client as any, { schema: fullSchema });
  }
  return instance;
}

export { 
  users, accounts, sessions, verificationTokens, authenticators, 
  destinations, packages, bookings, testimonials, enquiries, blogPosts 
} from "./schema";
export type { User, Package, Booking, Enquiry, Testimonial, BlogPost } from "./schema";
export * from "./relations";
