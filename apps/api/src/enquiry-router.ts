import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb, enquiries } from "@jemeka/db";
import { eq, desc, lt, and } from "drizzle-orm";

export const enquiryRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().optional(),
        message: z.string().min(10),
        destinationInterest: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      return db.insert(enquiries).values({
        ...input,
        status: "new",
      });
    }),

  // Admin only
  list: adminQuery
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const limit = input?.limit ?? 20;
      const conditions: any[] = [];
      if (input?.cursor !== undefined) {
        conditions.push(lt(enquiries.id, input.cursor));
      }
      const items = await db.query.enquiries.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [desc(enquiries.id)],
        limit: limit + 1,
      });
      let nextCursor: number | undefined;
      if (items.length > limit) {
        const next = items.pop();
        nextCursor = next!.id;
      }
      return { items, nextCursor };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "read", "responded", "closed"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      return db
        .update(enquiries)
        .set({ status: input.status })
        .where(eq(enquiries.id, input.id));
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      return db.delete(enquiries).where(eq(enquiries.id, input.id));
    }),
});
