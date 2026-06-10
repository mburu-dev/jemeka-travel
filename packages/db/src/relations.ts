import { relations } from "drizzle-orm";
import {
  users,
  destinations,
  packages,
  bookings,
  testimonials,
  enquiries,
  blogPosts,
} from "./schema";

// Destination → Packages (one-to-many)
export const destinationsRelations = relations(destinations, ({ many }) => ({
  packages: many(packages),
}));

// Package → Destination (many-to-one), Bookings, Testimonials
export const packagesRelations = relations(packages, ({ one, many }) => ({
  destination: one(destinations, {
    fields: [packages.destinationId],
    references: [destinations.id],
  }),
  bookings: many(bookings),
  testimonials: many(testimonials),
}));

// Booking → Package, User
export const bookingsRelations = relations(bookings, ({ one }) => ({
  package: one(packages, {
    fields: [bookings.packageId],
    references: [packages.id],
  }),
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));

// Testimonial → Package
export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  package: one(packages, {
    fields: [testimonials.packageId],
    references: [packages.id],
  }),
}));

// User → Bookings
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));
