import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "./middleware";
import { getDb, bookings } from "@jemeka/db";
import { eq, desc, and } from "drizzle-orm";

export function generateBookingRef() {
  const prefix = "JMK";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

export const bookingRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        packageId: z.number(),
        travelDate: z.string(),
        adults: z.number().min(1),
        children: z.number().min(0).default(0),
        totalPrice: z.string(),
        customerName: z.string().min(1),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        specialRequests: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const bookingReference = generateBookingRef();
      
      return db.insert(bookings).values({
        packageId: input.packageId,
        userId: ctx.user.id,
        travelDate: new Date(input.travelDate),
        adults: input.adults,
        children: input.children,
        totalPrice: input.totalPrice,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        specialRequests: input.specialRequests,
        bookingReference,
        status: "pending",
        paymentStatus: "pending",
      });
    }),

  getByReference: authedQuery
    .input(z.object({ reference: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const isAdmin = ctx.user.role === "admin";
      
      return db.query.bookings.findFirst({
        where: and(
          eq(bookings.bookingReference, input.reference),
          isAdmin ? undefined : eq(bookings.userId, ctx.user.id)
        ),
      });
    }),

  // Admin only
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.query.bookings.findMany({
      orderBy: [desc(bookings.createdAt)],
    });
  }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
        paymentStatus: z.enum(["pending", "partial", "paid", "refunded"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updates: any = { status: input.status };
      if (input.paymentStatus) {
        updates.paymentStatus = input.paymentStatus;
      }
      return db
        .update(bookings)
        .set(updates)
        .where(eq(bookings.id, input.id));
    }),
});
