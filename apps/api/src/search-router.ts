import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb, packages, destinations } from "@jemeka/db";
import { or, like } from "drizzle-orm";

export const searchRouter = createRouter({
  global: publicQuery
    .input(z.object({ q: z.string().min(2) }))
    .query(async ({ input }) => {
      const db = getDb();
      // SQLite LIKE is case-insensitive by default
      const term = `%${input.q}%`;

      const pkgs = await db.query.packages.findMany({
        where: or(
          like(packages.title, term),
          like(packages.description, term),
          like(packages.category, term)
        ),
        limit: 5,
      });

      const dests = await db.query.destinations.findMany({
        where: or(
          like(destinations.name, term),
          like(destinations.description, term),
          like(destinations.country, term)
        ),
        limit: 5,
      });

      return {
        packages: pkgs,
        destinations: dests,
      };
    }),
});
