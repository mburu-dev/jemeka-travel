import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { testimonials } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

export const testimonialRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        verified: z.boolean().optional(),
        limit: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(testimonials.isActive, true)];

      if (input?.verified !== undefined) {
        conditions.push(eq(testimonials.isVerified, input.verified));
      }

      const where = and(...conditions);

      return db.query.testimonials.findMany({
        where,
        orderBy: [desc(testimonials.createdAt)],
        limit: input?.limit ?? 50,
      });
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        rating: z.number().min(1).max(5),
        comment: z.string().min(10),
        destination: z.string().optional(),
        packageId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      return db.insert(testimonials).values({
        name: input.name,
        email: input.email,
        rating: input.rating,
        comment: input.comment,
        destination: input.destination,
        packageId: input.packageId,
        isVerified: false,
        isActive: true,
      });
    }),
});
