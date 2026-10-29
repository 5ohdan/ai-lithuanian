-- D1 always enforces foreign keys. Defer checks until the migration commits.
-- Keep the legacy parent until both referencing tables have been rebuilt.
PRAGMA defer_foreign_keys=ON;--> statement-breakpoint
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
CREATE TABLE `__new_user_data` (
	`user_id` text PRIMARY KEY NOT NULL,
	`difficulty` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_data`("user_id", "difficulty") SELECT "user_id", "difficulty" FROM `user_data`;--> statement-breakpoint
DROP TABLE `user_data`;--> statement-breakpoint
ALTER TABLE `__new_user_data` RENAME TO `user_data`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
-- Validate explicitly before clearing deferred checks. Rebuilding parent tables
-- can leave SQLite's deferred counter nonzero even after references are valid.
CREATE TABLE `__migration_fk_check` (`violations` integer CHECK (`violations` = 0));--> statement-breakpoint
INSERT INTO `__migration_fk_check` SELECT COUNT(*) FROM pragma_foreign_key_check;--> statement-breakpoint
DROP TABLE `__migration_fk_check`;--> statement-breakpoint
PRAGMA defer_foreign_keys=OFF;