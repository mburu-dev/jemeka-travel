import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { packages, destinations } from "@db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export const packageRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        destinationId: z.number().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        duration: z.number().optional(),
        featured: z.boolean().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.category) {
        conditions.push(eq(packages.category, input.category as any));
      }
      if (input?.destinationId) {
        conditions.push(eq(packages.destinationId, input.destinationId));
      }
      if (input?.minPrice !== undefined) {
        conditions.push(gte(packages.price, input.minPrice.toString()));
      }
      if (input?.maxPrice !== undefined) {
        conditions.push(lte(packages.price, input.maxPrice.toString()));
      }
      if (input?.duration) {
        conditions.push(eq(packages.duration, input.duration));
      }
      if (input?.featured !== undefined) {
        conditions.push(eq(packages.isFeatured, input.featured));
      }
      conditions.push(eq(packages.isActive, true));

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      return db.query.packages.findMany({
        where,
        orderBy: (packages, { desc }) => [desc(packages.isFeatured), desc(packages.rating)],
      });
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const pkg = await db.query.packages.findFirst({
        where: eq(packages.slug, input.slug),
      });

      if (!pkg) {
        throw new Error("Package not found");
      }

      const destination = await db.query.destinations.findFirst({
        where: eq(destinations.id, pkg.destinationId),
      });

      return { ...pkg, destination };
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db.query.packages.findMany({
      where: and(eq(packages.isFeatured, true), eq(packages.isActive, true)),
      orderBy: (packages, { desc }) => [desc(packages.rating)],
      limit: 6,
    });
  }),

  categories: publicQuery.query(async () => {
    return [
      { value: "adventure", label: "Adventure" },
      { value: "cultural", label: "Cultural" },
      { value: "wildlife", label: "Wildlife Safari" },
      { value: "beach", label: "Beach" },
      { value: "luxury", label: "Luxury" },
      { value: "budget", label: "Budget" },
      { value: "family", label: "Family" },
      { value: "honeymoon", label: "Honeymoon" },
    ];
  }),
});
