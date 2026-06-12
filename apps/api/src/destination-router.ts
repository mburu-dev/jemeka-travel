import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb, destinations, packages } from "@jemeka/db";
import { eq, and } from "drizzle-orm";

export const destinationRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        region: z.string().optional(),
        featured: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.region) {
        conditions.push(eq(destinations.region, input.region as "africa" | "europe" | "asia" | "americas" | "oceania"));
      }
      if (input?.featured !== undefined) {
        conditions.push(eq(destinations.isFeatured, input.featured));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      return db.query.destinations.findMany({
        where,
        orderBy: (d: any, { desc }: any) => [desc(d.isFeatured)],
      });
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.query.destinations.findFirst({
        where: eq(destinations.slug, input.slug),
      });

      if (!result) {
        throw new Error("Destination not found");
      }

      // Get packages for this destination
      const destinationPackages = await db.query.packages.findMany({
        where: and(
          eq(packages.destinationId, result.id),
          eq(packages.isActive, true)
        ),
      });

      return { ...result, packages: destinationPackages };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.query.destinations.findFirst({
        where: eq(destinations.id, input.id),
      });
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db.query.destinations.findMany({
      where: eq(destinations.isFeatured, true),
      orderBy: (d: any, { asc }: any) => [asc(d.name)],
    });
  }),
});
