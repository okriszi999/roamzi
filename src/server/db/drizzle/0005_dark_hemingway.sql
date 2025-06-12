CREATE TABLE `trip_participants` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`joined_at` text NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trip_stops` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`lat` integer NOT NULL,
	`lng` integer NOT NULL,
	`trip_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`type` text DEFAULT 'stop' NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP INDEX `authenticator_credentialID_unique`;--> statement-breakpoint
ALTER TABLE `trips` ADD `owner_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `trips` DROP COLUMN `stops`;--> statement-breakpoint
ALTER TABLE `user` ADD `created_at` text;--> statement-breakpoint
ALTER TABLE `user` ADD `password` text NOT NULL;