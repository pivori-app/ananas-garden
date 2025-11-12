CREATE TABLE `bouquet_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bouquetId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`isVerified` int NOT NULL DEFAULT 0,
	`isVisible` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bouquet_ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bouquet_ratings` ADD CONSTRAINT `bouquet_ratings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bouquet_ratings` ADD CONSTRAINT `bouquet_ratings_bouquetId_bouquets_id_fk` FOREIGN KEY (`bouquetId`) REFERENCES `bouquets`(`id`) ON DELETE no action ON UPDATE no action;