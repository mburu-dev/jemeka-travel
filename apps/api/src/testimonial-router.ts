import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb, testimonials } from "@jemeka/db";
import { eq, and, desc, lt } from "drizzle-orm";

export const testimonialRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        verified: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.number().optional(), // last id from previous page
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      const db = ctx.db || getDb();
      const limit = input?.limit ?? 20;
      const conditions = [eq(testimonials.isActive, true)];

      if (input?.verified !== undefined) {
        conditions.push(eq(testimonials.isVerified, input.verified));
      }
      if (input?.cursor !== undefined) {
        conditions.push(lt(testimonials.id, input.cursor));
      }

      const where = and(...conditions);

      const items = await db.query.testimonials.findMany({
        where,
        orderBy: [desc(testimonials.id)],
        limit: limit + 1, // fetch one extra to determine if there's a next page
      });

      let nextCursor: number | undefined;
      if (items.length > limit) {
        const next = items.pop();
        nextCursor = next!.id;
      }

      return { items, nextCursor };
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
    .mutation(async ({ input, ctx }) => {
      const db = ctx.db || getDb();
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
  
  // Admin only
  all: adminQuery.query(async ({ ctx }) => {
    const db = ctx.db || getDb();
    return db.query.testimonials.findMany({
      orderBy: [desc(testimonials.createdAt)],
    });
  }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        isVerified: z.boolean().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = ctx.db || getDb();
      const updates: Record<string, unknown> = {};
      if (input.isVerified !== undefined) updates.isVerified = input.isVerified;
      if (input.isActive !== undefined) updates.isActive = input.isActive;
      
      return db
        .update(testimonials)
        .set(updates)
        .where(eq(testimonials.id, input.id));
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = ctx.db || getDb();
      return db.delete(testimonials).where(eq(testimonials.id, input.id));
    }),
});
