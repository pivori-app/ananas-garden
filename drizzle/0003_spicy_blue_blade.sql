CREATE TABLE `loyaltyPoints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`points` int NOT NULL DEFAULT 0,
	`totalEarned` int NOT NULL DEFAULT 0,
	`totalSpent` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loyaltyPoints_id` PRIMARY KEY(`id`),
	CONSTRAINT `loyaltyPoints_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `loyaltyTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`points` int NOT NULL,
	`type` enum('earned','spent','bonus') NOT NULL,
	`description` text NOT NULL,
	`orderId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loyaltyTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `loyaltyPoints` ADD CONSTRAINT `loyaltyPoints_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loyaltyTransactions` ADD CONSTRAINT `loyaltyTransactions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loyaltyTransactions` ADD CONSTRAINT `loyaltyTransactions_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;