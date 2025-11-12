CREATE TABLE `birthday_contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`birthDate` timestamp NOT NULL,
	`address` text,
	`phone` varchar(20),
	`email` varchar(320),
	`preferences` text,
	`googleCalendarEventId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `birthday_contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `birthday_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactId` int NOT NULL,
	`userId` int NOT NULL,
	`bouquetId` int,
	`orderDate` timestamp NOT NULL DEFAULT (now()),
	`deliveryDate` timestamp NOT NULL,
	`status` enum('pending','confirmed','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `birthday_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `birthday_contacts` ADD CONSTRAINT `birthday_contacts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `birthday_orders` ADD CONSTRAINT `birthday_orders_contactId_birthday_contacts_id_fk` FOREIGN KEY (`contactId`) REFERENCES `birthday_contacts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `birthday_orders` ADD CONSTRAINT `birthday_orders_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `birthday_orders` ADD CONSTRAINT `birthday_orders_bouquetId_bouquets_id_fk` FOREIGN KEY (`bouquetId`) REFERENCES `bouquets`(`id`) ON DELETE no action ON UPDATE no action;