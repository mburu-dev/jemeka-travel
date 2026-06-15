import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "./middleware";
import { getDb, bookings, packages } from "@jemeka/db";
import { eq, desc, and, lt } from "drizzle-orm";
import { sendBookingConfirmation, sendBookingStatusUpdate } from "./lib/email";

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
      const db = ctx.db || getDb();
      const bookingReference = generateBookingRef();
      
      const result = await db.insert(bookings).values({
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
      }).returning();

      // Send booking confirmation email asynchronously without blocking the response
      db.query.packages.findFirst({
        where: eq(packages.id, input.packageId),
      }).then(async (pkg: any) => {
        if (pkg) {
          await sendBookingConfirmation({
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            bookingReference,
            travelDate: input.travelDate,
            packageTitle: pkg.title,
            totalPrice: input.totalPrice,
          });
        }
      }).catch((err: any) => {
        // Log error but don't fail the request if email sending fails
        console.error("Failed to trigger booking confirmation email:", err);
      });

      return result;
    }),

  getByReference: authedQuery
    .input(z.object({ reference: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = ctx.db || getDb();
      const isAdmin = ctx.user.role === "admin";
      
      return db.query.bookings.findFirst({
        where: and(
          eq(bookings.bookingReference, input.reference),
          isAdmin ? undefined : eq(bookings.userId, ctx.user.id)
        ),
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
    .query(async ({ input, ctx }) => {
      const db = ctx.db || getDb();
      const limit = input?.limit ?? 20;
      const conditions: any[] = [];
      if (input?.cursor !== undefined) {
        conditions.push(lt(bookings.id, input.cursor));
      }
      const items = await db.query.bookings.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [desc(bookings.id)],
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
        status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
        paymentStatus: z.enum(["pending", "partial", "paid", "refunded"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = ctx.db || getDb();
      
      // Fetch current booking to check if status actually changed
      const currentBooking = await db.query.bookings.findFirst({
        where: eq(bookings.id, input.id),
      });

      if (!currentBooking) {
        throw new Error("Booking not found");
      }

      const updates: Record<string, unknown> = { status: input.status, updatedAt: new Date() };
      if (input.paymentStatus) {
        updates.paymentStatus = input.paymentStatus;
      }
      
      const result = await db
        .update(bookings)
        .set(updates)
        .where(eq(bookings.id, input.id))
        .returning();

      // If status changed to something other than pending, send email
      if (currentBooking.status !== input.status && input.status !== "pending") {
        db.query.packages.findFirst({
          where: eq(packages.id, currentBooking.packageId),
        }).then(async (pkg: any) => {
          if (pkg) {
            await sendBookingStatusUpdate({
              customerName: currentBooking.customerName,
              customerEmail: currentBooking.customerEmail,
              bookingReference: currentBooking.bookingReference,
              travelDate: currentBooking.travelDate.toISOString(),
              packageTitle: pkg.title,
              totalPrice: currentBooking.totalPrice,
              newStatus: input.status as "confirmed" | "cancelled" | "completed",
            });
          }
        }).catch((err: any) => {
          console.error("Failed to trigger booking status email:", err);
        });
      }

      return result;
    }),
});
