PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`author` text,
	`category` text,
	`tags` text,
	`featured_image` text,
	`is_published` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_blog_posts`("id", "title", "slug", "excerpt", "content", "author", "category", "tags", "featured_image", "is_published", "created_at", "updated_at") SELECT "id", "title", "slug", "excerpt", "content", "author", "category", "tags", "featured_image", "is_published", "created_at", "updated_at" FROM `blog_posts`;--> statement-breakpoint
DROP TABLE `blog_posts`;--> statement-breakpoint
ALTER TABLE `__new_blog_posts` RENAME TO `blog_posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`package_id` integer NOT NULL,
	`booking_reference` text NOT NULL,
	`travel_date` integer NOT NULL,
	`adults` integer DEFAULT 1 NOT NULL,
	`children` integer DEFAULT 0,
	`total_price` text NOT NULL,
	`status` text DEFAULT 'pending',
	`payment_status` text DEFAULT 'pending',
	`transaction_id` text,
	`special_requests` text,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`customer_phone` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_bookings`("id", "user_id", "package_id", "booking_reference", "travel_date", "adults", "children", "total_price", "status", "payment_status", "transaction_id", "special_requests", "customer_name", "customer_email", "customer_phone", "created_at", "updated_at") SELECT "id", "user_id", "package_id", "booking_reference", "travel_date", "adults", "children", "total_price", "status", "payment_status", NULL, "special_requests", "customer_name", "customer_email", "customer_phone", "created_at", "updated_at" FROM `bookings`;--> statement-breakpoint
DROP TABLE `bookings`;--> statement-breakpoint
ALTER TABLE `__new_bookings` RENAME TO `bookings`;--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_booking_reference_unique` ON `bookings` (`booking_reference`);--> statement-breakpoint
CREATE TABLE `__new_destinations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`country` text NOT NULL,
	`region` text NOT NULL,
	`description` text NOT NULL,
	`short_description` text,
	`highlights` text,
	`best_time_to_visit` text,
	`image` text,
	`gallery` text,
	`coordinates` text,
	`activities` text,
	`experience_categories` text,
	`wildlife` text,
	`duration_recommendations` text,
	`video_experience_url` text,
	`destination_testimonials` text,
	`is_featured` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_destinations`("id", "name", "slug", "country", "region", "description", "short_description", "highlights", "best_time_to_visit", "image", "gallery", "coordinates", "activities", "experience_categories", "wildlife", "duration_recommendations", "video_experience_url", "destination_testimonials", "is_featured", "is_active", "created_at", "updated_at") SELECT "id", "name", "slug", "country", "region", "description", NULL, NULL, NULL, "image", NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, "is_featured", "is_active", "created_at", "updated_at" FROM `destinations`;--> statement-breakpoint
DROP TABLE `destinations`;--> statement-breakpoint
ALTER TABLE `__new_destinations` RENAME TO `destinations`;--> statement-breakpoint
CREATE UNIQUE INDEX `destinations_slug_unique` ON `destinations` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_enquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`subject` text,
	`message` text NOT NULL,
	`destination_interest` text,
	`status` text DEFAULT 'new',
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_enquiries`("id", "name", "email", "phone", "subject", "message", "destination_interest", "status", "created_at") SELECT "id", "name", "email", "phone", "subject", "message", "destination_interest", "status", "created_at" FROM `enquiries`;--> statement-breakpoint
DROP TABLE `enquiries`;--> statement-breakpoint
ALTER TABLE `__new_enquiries` RENAME TO `enquiries`;--> statement-breakpoint
CREATE TABLE `__new_packages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`destination_id` integer NOT NULL,
	`description` text NOT NULL,
	`short_description` text,
	`duration` integer NOT NULL,
	`max_group_size` integer NOT NULL,
	`price` text NOT NULL,
	`deposit_amount` text,
	`currency` text DEFAULT 'USD',
	`inclusions` text,
	`exclusions` text,
	`itinerary` text,
	`gallery` text,
	`image` text,
	`category` text NOT NULL,
	`difficulty` text DEFAULT 'easy',
	`is_featured` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`rating` real DEFAULT 0,
	`review_count` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_packages`("id", "title", "slug", "destination_id", "description", "short_description", "duration", "max_group_size", "price", "deposit_amount", "currency", "inclusions", "exclusions", "itinerary", "gallery", "image", "category", "difficulty", "is_featured", "is_active", "rating", "review_count", "created_at", "updated_at") SELECT "id", "title", "slug", "destination_id", "description", "short_description", "duration", "max_group_size", "price", "deposit_amount", "currency", "inclusions", "exclusions", "itinerary", "gallery", "image", "category", "difficulty", "is_featured", "is_active", "rating", "review_count", "created_at", "updated_at" FROM `packages`;--> statement-breakpoint
DROP TABLE `packages`;--> statement-breakpoint
ALTER TABLE `__new_packages` RENAME TO `packages`;--> statement-breakpoint
CREATE UNIQUE INDEX `packages_slug_unique` ON `packages` (`slug`);--> statement-breakpoint
CREATE TABLE `__new_testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`avatar` text,
	`rating` integer NOT NULL,
	`comment` text NOT NULL,
	`package_id` integer,
	`destination` text,
	`is_verified` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_testimonials`("id", "name", "email", "avatar", "rating", "comment", "package_id", "destination", "is_verified", "is_active", "created_at") SELECT "id", "name", "email", "avatar", "rating", "comment", "package_id", "destination", "is_verified", "is_active", "created_at" FROM `testimonials`;--> statement-breakpoint
DROP TABLE `testimonials`;--> statement-breakpoint
ALTER TABLE `__new_testimonials` RENAME TO `testimonials`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`emailVerified` integer,
	`image` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "emailVerified", "image", "role", "createdAt", "updatedAt") SELECT "id", "name", "email", "emailVerified", "image", "role", "createdAt", "updatedAt" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);