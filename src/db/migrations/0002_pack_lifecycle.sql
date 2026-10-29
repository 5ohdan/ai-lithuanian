-- Rebuild to add a CURRENT_TIMESTAMP default even when packs already exist.
-- ALTER TABLE ADD COLUMN cannot add this non-constant default to populated SQLite tables.
PRAGMA defer_foreign_keys=ON;
--> statement-breakpoint
CREATE TABLE `__new_packs` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `difficulty` text NOT NULL,
  `status` text DEFAULT 'initial_ready' NOT NULL,
  `error_message` text,
  `users_topic` text NOT NULL,
  `created_at` integer DEFAULT CURRENT_TIMESTAMP,
  `updated_at` integer DEFAULT CURRENT_TIMESTAMP,
  `user_id` text,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_packs` (
  `id`, `title`, `difficulty`, `users_topic`, `created_at`, `updated_at`, `user_id`
)
SELECT `id`, `title`, `difficulty`, `users_topic`, `created_at`,
  COALESCE(`created_at`, CURRENT_TIMESTAMP), `user_id`
FROM `packs`;
--> statement-breakpoint
DROP TABLE `packs`;
--> statement-breakpoint
ALTER TABLE `__new_packs` RENAME TO `packs`;
--> statement-breakpoint
CREATE TABLE `__migration_fk_check` (`violations` integer CHECK (`violations` = 0));
--> statement-breakpoint
INSERT INTO `__migration_fk_check` SELECT COUNT(*) FROM pragma_foreign_key_check;
--> statement-breakpoint
DROP TABLE `__migration_fk_check`;
--> statement-breakpoint
PRAGMA defer_foreign_keys=OFF;
