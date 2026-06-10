import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { enquiries } from "@db/schema";
import { eq, desc } from "drizzle-orm";

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
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.query.enquiries.findMany({
      orderBy: [desc(enquiries.createdAt)],
    });
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
