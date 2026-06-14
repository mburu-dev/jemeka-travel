import { serve } from "@hono/node-server";
import { logger } from "./lib/logger";
import { app } from "./app";

const port = parseInt(process.env.PORT ?? "4000");
logger.info(`🚀 Jemeka Tours API running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });

export type { AppRouter } from "./app";
