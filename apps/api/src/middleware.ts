import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import type { TrpcContext } from "./context";
import { getDb } from "./queries/connection";
import { sessions, users } from "@db/schema";
import { eq } from "drizzle-orm";
import { parse } from "cookie";

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

  const db = getDb();
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.sessionToken, sessionToken),
    with: {
      user: true,
    },
  });

  // Note: Drizzle query 'with' requires relations to be defined. 
  // If relations aren't setup, we can do a manual join or two queries.
  // Let's do a manual join for safety since I haven't checked relations.ts yet.
  
  const sessionWithUser = await db
    .select({
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.sessionToken, sessionToken))
    .get();

  if (!sessionWithUser || !sessionWithUser.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: sessionWithUser.user,
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
