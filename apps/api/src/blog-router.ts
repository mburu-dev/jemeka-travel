import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { blogPosts } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

export const blogRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        limit: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(blogPosts.isPublished, true)];

      if (input?.category) {
        conditions.push(eq(blogPosts.category, input.category));
      }

      const where = and(...conditions);

      return db.query.blogPosts.findMany({
        where,
        orderBy: [desc(blogPosts.createdAt)],
        limit: input?.limit ?? 50,
      });
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, input.slug),
      });
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db.query.blogPosts.findMany({
      where: eq(blogPosts.isPublished, true),
      orderBy: [desc(blogPosts.createdAt)],
      limit: 3,
    });
  }),
});
