CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `authenticator` (
	`credentialID` text NOT NULL,
	`userId` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`credentialPublicKey` text NOT NULL,
	`counter` integer NOT NULL,
	`credentialDeviceType` text NOT NULL,
	`credentialBackedUp` integer NOT NULL,
	`transports` text,
	PRIMARY KEY(`userId`, `credentialID`),
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE TABLE `blog_posts` (
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
	`created_at` integer DEFAULT '"2026-06-10T08:45:58.756Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-06-10T08:45:58.756Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `bookings` (
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
	`special_requests` text,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`customer_phone` text,
	`created_at` integer DEFAULT '"2026-06-10T08:45:58.755Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-06-10T08:45:58.755Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_booking_reference_unique` ON `bookings` (`booking_reference`);--> statement-breakpoint
CREATE TABLE `destinations` (
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
	`is_featured` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`created_at` integer DEFAULT '"2026-06-10T08:45:58.752Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-06-10T08:45:58.752Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `destinations_slug_unique` ON `destinations` (`slug`);--> statement-breakpoint
CREATE TABLE `enquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`subject` text,
	`message` text NOT NULL,
	`destination_interest` text,
	`status` text DEFAULT 'new',
	`created_at` integer DEFAULT '"2026-06-10T08:45:58.755Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `packages` (
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
	`created_at` integer DEFAULT '"2026-06-10T08:45:58.754Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2026-06-10T08:45:58.754Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `packages_slug_unique` ON `packages` (`slug`);--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
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
	`created_at` integer DEFAULT '"2026-06-10T08:45:58.755Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`emailVerified` integer,
	`image` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer DEFAULT '"2026-06-10T08:45:58.745Z"' NOT NULL,
	`updatedAt` integer DEFAULT '"2026-06-10T08:45:58.746Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
