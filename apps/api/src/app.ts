import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { logger } from "./lib/logger";
import { getDb } from "@jemeka/db";
import { sql } from "drizzle-orm";
import { env } from "./lib/env";
import paystackWebhook from "./webhooks/paystack";
import { bookingRateLimit, enquiryRateLimit } from "./lib/rate-limit";

export const app = new Hono();

// Security headers on all routes
app.use("*", secureHeaders({
  xFrameOptions: "DENY",
  xContentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",
}));

// Cloudflare env injection for Database
app.use("*", async (c, next) => {
  // @ts-ignore
  if (c.env && c.env.DATABASE_URL) {
    // @ts-ignore
    getDb(c.env.DATABASE_URL, c.env.DATABASE_AUTH_TOKEN);
  }
  await next();
});

const allowedOrigins = ["http://localhost:3000"];
if (env.frontendUrl) {
  allowedOrigins.push(env.frontendUrl);
}

// CORS — allow the Next.js frontend
app.use(
  "/api/trpc/*",
  cors({
    origin: allowedOrigins,
    allowHeaders: ["Content-Type", "Authorization", "x-trpc-source"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

// Health check — verifies DB connectivity
app.get("/health", async (c) => {
  try {
    const db = getDb();
    await db.run(sql`SELECT 1`);
    return c.json({ ok: true, db: "connected", ts: Date.now() });
  } catch (e) {
    logger.error({ error: e }, "Health check DB probe failed");
    return c.json({ ok: false, db: "disconnected", ts: Date.now() }, 503);
  }
});

// Webhooks
app.route("/api/webhooks/paystack", paystackWebhook);

// Rate limiting on high-risk mutation endpoints
// tRPC mutations arrive as POST requests with the procedure name in the URL path
app.use("/api/trpc/booking.create", bookingRateLimit as any);
app.use("/api/trpc/enquiry.create", enquiryRateLimit as any);

import { PostHog } from "posthog-node";

// Initialize PostHog if API key is provided
const posthog = env.posthogApiKey 
  ? new PostHog(env.posthogApiKey, { host: env.posthogHost }) 
  : null;

// tRPC handler
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
    onError({ error, path }) {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        logger.error({ error, path }, "tRPC internal error");
        if (posthog) {
          posthog.capture({
            distinctId: "server",
            event: "api_internal_error",
            properties: {
              path,
              errorMessage: error.message,
              stack: error.stack,
            },
          });
        }
      }
    },
  });
});

app.onError((err, c) => {
  logger.error({ err, path: c.req.path }, "Unhandled API error");
  if (posthog) {
    posthog.capture({
      distinctId: "server",
      event: "api_unhandled_error",
      properties: {
        path: c.req.path,
        errorMessage: err.message,
        stack: err.stack,
      },
    });
  }
  return c.json({ error: "Internal Server Error" }, 500);
});

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export type { AppRouter } from "./router";
