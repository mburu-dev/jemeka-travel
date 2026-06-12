import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { logger } from "./lib/logger";

import { env } from "./lib/env";
import { rateLimiter } from "hono-rate-limiter";

const app = new Hono();

const allowedOrigins = ["http://localhost:3000"];
if (env.frontendUrl) {
  allowedOrigins.push(env.frontendUrl);
}

// CORS — allow the Next.js frontend
app.use(
  "/api/trpc/*",
  cors({
    origin: allowedOrigins,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

// Rate limiter for specific endpoints (booking.create, enquiry.create)
// Applying it generally to the trpc route with a sensible limit.
app.use(
  "/api/trpc/booking.create",
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, 
    standardHeaders: "draft-6",
    keyGenerator: (c) => c.req.header("x-forwarded-for") || c.req.header("true-client-ip") || "anonymous",
  })
);

app.use(
  "/api/trpc/enquiry.create",
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5,
    standardHeaders: "draft-6",
    keyGenerator: (c) => c.req.header("x-forwarded-for") || c.req.header("true-client-ip") || "anonymous",
  })
);

import paystackWebhook from "./webhooks/paystack";

// Health check
app.get("/health", (c) => c.json({ ok: true, ts: Date.now() }));

// Webhooks
app.route("/api/webhooks/paystack", paystackWebhook);

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
      }
    },
  });
});

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

const port = parseInt(process.env.PORT ?? "4000");
logger.info(`🚀 Jemeka Tours API running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });

export type { AppRouter } from "./router";
