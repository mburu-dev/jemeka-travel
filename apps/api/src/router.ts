import { authRouter } from "./auth-router";
import { destinationRouter } from "./destination-router";
import { packageRouter } from "./package-router";
import { testimonialRouter } from "./testimonial-router";
import { enquiryRouter } from "./enquiry-router";
import { bookingRouter } from "./booking-router";
import { blogRouter } from "./blog-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  destination: destinationRouter,
  package: packageRouter,
  testimonial: testimonialRouter,
  enquiry: enquiryRouter,
  booking: bookingRouter,
  blog: blogRouter,
});

export type AppRouter = typeof appRouter;
