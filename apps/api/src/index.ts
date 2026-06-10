import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { logger } from "./lib/logger";

const app = new Hono();

// CORS — allow the Next.js frontend on port 3000
app.use(
  "/api/trpc/*",
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL ?? ""],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

// Health check
app.get("/health", (c) => c.json({ ok: true, ts: Date.now() }));

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
