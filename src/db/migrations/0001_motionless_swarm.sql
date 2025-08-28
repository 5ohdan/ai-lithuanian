DROP TABLE `users`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_packs` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`difficulty` text NOT NULL,
	`users_topic` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_packs`("id", "title", "difficulty", "users_topic", "created_at", "user_id") SELECT "id", "title", "difficulty", "users_topic", "created_at", "user_id" FROM `packs`;--> statement-breakpoint
DROP TABLE `packs`;--> statement-breakpoint
ALTER TABLE `__new_packs` RENAME TO `packs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_user_data` (
	`user_id` text PRIMARY KEY NOT NULL,
	`difficulty` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_data`("user_id", "difficulty") SELECT "user_id", "difficulty" FROM `user_data`;--> statement-breakpoint
DROP TABLE `user_data`;--> statement-breakpoint
ALTER TABLE `__new_user_data` RENAME TO `user_data`;