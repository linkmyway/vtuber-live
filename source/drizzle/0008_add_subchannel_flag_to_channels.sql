ALTER TABLE `channels` ADD COLUMN `is_sub` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `channels` ADD COLUMN `sub_name` text DEFAULT '' NOT NULL;
