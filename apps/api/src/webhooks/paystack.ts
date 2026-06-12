import { Hono } from "hono";
import crypto from "crypto";
import { getDb, bookings } from "@jemeka/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const paystackWebhook = new Hono();

paystackWebhook.post("/", async (c) => {
  const signature = c.req.header("x-paystack-signature");
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret || !signature) {
    return c.json({ error: "Missing signature or secret" }, 400);
  }

  const rawBody = await c.req.text();
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

  if (hash !== signature) {
    logger.warn("Invalid Paystack signature");
    return c.json({ error: "Invalid signature" }, 400);
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (e) {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  if (event.event === "charge.success") {
    const data = event.data;
    const reference = data.reference;
    const transactionId = data.id ? data.id.toString() : null;

    try {
      const db = getDb();
      await db.update(bookings)
        .set({ 
          paymentStatus: "paid", 
          transactionId: transactionId,
          status: "confirmed" 
        })
        .where(eq(bookings.bookingReference, reference));
        
      logger.info(`Paystack charge success for reference: ${reference}`);
    } catch (e) {
      logger.error({ error: e, reference }, "Failed to update booking on Paystack webhook");
      return c.json({ error: "Database error" }, 500);
    }
  }

  return c.json({ status: "success" }, 200);
});

export default paystackWebhook;
