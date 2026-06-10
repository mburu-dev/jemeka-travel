import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import type { TrpcContext } from "./context";
import { getDb, sessions, users } from "@jemeka/db";
import { eq } from "drizzle-orm";
import { parse } from "cookie";
import { jwtVerify } from "jose";

const AUTH_SECRET = process.env.AUTH_SECRET;

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof z.ZodError ? error.cause.flatten() : null,
        // Add a custom error code if needed
        customCode: error.code,
      },
    };
  },
});

export const createRouter = t.router;
export const publicQuery = t.procedure;

// Helper to verify Auth.js session token
async function verifySessionToken(token: string) {
  if (!AUTH_SECRET) {
    console.error("AUTH_SECRET is not set in API environment");
    return null;
  }

  try {
    // If Auth.js is using JWT strategy, we verify the JWT
    // If it's using database strategy, the token is a random sessionToken
    // For database strategy, we still do a DB lookup but we should ensure the token 
    // is coming from a trusted source (signed cookie).
    // Note: Auth.js v5 database sessions are just random tokens in cookies.
    // The "standard" way to verify them in a separate API is a DB lookup.
    
    const db = getDb();
    const sessionWithUser = await db
      .select({
        user: users,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.sessionToken, token))
      .get();

    return sessionWithUser?.user || null;
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}

// Middleware to verify Auth.js session from database
const isAuthed = t.middleware(async ({ ctx, next }) => {
  const cookieHeader = ctx.req.headers.get("cookie");
  if (!cookieHeader) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const cookies = parse(cookieHeader);
  const sessionToken = cookies["authjs.session-token"] || cookies["__Secure-authjs.session-token"];

  if (!sessionToken) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = await verifySessionToken(sessionToken);

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});

const isAdmin = t.middleware(async ({ ctx, next }) => {
  // First run authed middleware logic or just check ctx.user if already populated
  // For simplicity in this procedural definition, we'll re-verify or use a composed middleware
  if (!ctx.user || ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});

export const authedQuery = t.procedure.use(isAuthed);
export const adminQuery = authedQuery.use(isAdmin);
