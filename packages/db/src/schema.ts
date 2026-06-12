import {
  sqliteTable,
  integer,
  text,
  real,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

// --- Auth.js Tables ---

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Destinations table
export const destinations = sqliteTable("destinations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  country: text("country").notNull(),
  region: text("region", { enum: ["africa", "europe", "asia", "americas", "oceania"] }).notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  highlights: text("highlights", { mode: "json" }).$type<string[]>(),
  bestTimeToVisit: text("best_time_to_visit"),
  image: text("image"),
  gallery: text("gallery", { mode: "json" }).$type<string[]>(),
  coordinates: text("coordinates", { mode: "json" }).$type<{ lat: number; lng: number }>(),
  activities: text("activities", { mode: "json" }).$type<string[]>(),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = typeof destinations.$inferInsert;

// Tour Packages table
export const packages = sqliteTable("packages", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  destinationId: integer("destination_id", { mode: "number" }).notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  duration: integer("duration").notNull(), // days
  maxGroupSize: integer("max_group_size").notNull(),
  price: text("price").notNull(), // storing decimal as string in sqlite for precision
  depositAmount: text("deposit_amount"),
  currency: text("currency").default("USD"),
  inclusions: text("inclusions", { mode: "json" }).$type<string[]>(),
  exclusions: text("exclusions", { mode: "json" }).$type<string[]>(),
  itinerary: text("itinerary", { mode: "json" }).$type<{ day: number; title: string; description: string }[]>(),
  gallery: text("gallery", { mode: "json" }).$type<string[]>(),
  image: text("image"),
  category: text("category", {
    enum: [
      "adventure",
      "cultural",
      "wildlife",
      "beach",
      "luxury",
      "budget",
      "family",
      "honeymoon",
    ]
  }).notNull(),
  difficulty: text("difficulty", { enum: ["easy", "moderate", "challenging"] }).default("easy"),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type Package = typeof packages.$inferSelect;
export type InsertPackage = typeof packages.$inferInsert;

// Bookings table
export const bookings = sqliteTable("bookings", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id"),
  packageId: integer("package_id", { mode: "number" }).notNull(),
  bookingReference: text("booking_reference").notNull().unique(),
  travelDate: integer("travel_date", { mode: "timestamp" }).notNull(),
  adults: integer("adults").notNull().default(1),
  children: integer("children").default(0),
  totalPrice: text("total_price").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "cancelled", "completed"] }).default("pending"),
  paymentStatus: text("payment_status", { enum: ["pending", "partial", "paid", "refunded"] }).default("pending"),
  transactionId: text("transaction_id"),
  specialRequests: text("special_requests"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// Testimonials/Reviews table
export const testimonials = sqliteTable("testimonials", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email"),
  avatar: text("avatar"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  packageId: integer("package_id", { mode: "number" }),
  destination: text("destination"),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// Enquiries/Contact form submissions
export const enquiries = sqliteTable("enquiries", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  destinationInterest: text("destination_interest"),
  status: text("status", { enum: ["new", "read", "responded", "closed"] }).default("new"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type InsertEnquiry = typeof enquiries.$inferInsert;

// Blog Posts table
export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  author: text("author"),
  category: text("category"),
  tags: text("tags", { mode: "json" }).$type<string[]>(),
  featuredImage: text("featured_image"),
  isPublished: integer("is_published", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
