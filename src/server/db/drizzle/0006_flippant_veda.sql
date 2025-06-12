PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trip_stops` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`trip_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`type` text DEFAULT 'stop' NOT NULL,
	FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_trip_stops`("id", "title", "description", "lat", "lng", "trip_id", "created_at", "updated_at", "order", "type") SELECT "id", "title", "description", "lat", "lng", "trip_id", "created_at", "updated_at", "order", "type" FROM `trip_stops`;--> statement-breakpoint
DROP TABLE `trip_stops`;--> statement-breakpoint
ALTER TABLE `__new_trip_stops` RENAME TO `trip_stops`;--> statement-breakpoint
PRAGMA foreign_keys=ON;