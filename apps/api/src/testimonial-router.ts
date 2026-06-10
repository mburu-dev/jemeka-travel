import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
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
  
  // Admin only
  all: adminQuery.query(async () => {
    const db = getDb();
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
      const db = getDb();
      const updates: any = {};
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
      const db = getDb();
      return db.delete(testimonials).where(eq(testimonials.id, input.id));
    }),
});
