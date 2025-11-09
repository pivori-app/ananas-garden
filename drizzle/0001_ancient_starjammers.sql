CREATE TABLE `bouquetFlowers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bouquetId` int NOT NULL,
	`flowerId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	CONSTRAINT `bouquetFlowers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bouquets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`originalMessage` text NOT NULL,
	`occasion` varchar(100),
	`budget` enum('economique','standard','premium') NOT NULL,
	`dominantColors` text,
	`style` enum('moderne','romantique','champetre','luxe'),
	`totalPrice` int NOT NULL,
	`explanation` text,
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bouquets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cartItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`sessionId` varchar(255),
	`bouquetId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cartItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flowers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`scientificName` varchar(150),
	`symbolism` text NOT NULL,
	`emotions` text NOT NULL,
	`keywords` text NOT NULL,
	`color` varchar(50) NOT NULL,
	`pricePerStem` int NOT NULL,
	`stock` int NOT NULL DEFAULT 100,
	`imageUrl` text,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `flowers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`bouquetId` int,
	`quantity` int NOT NULL DEFAULT 1,
	`unitPrice` int NOT NULL,
	`totalPrice` int NOT NULL,
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`customerName` varchar(200) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(20),
	`deliveryAddress` text NOT NULL,
	`deliveryDate` timestamp,
	`personalMessage` text,
	`addVase` int NOT NULL DEFAULT 0,
	`vasePrice` int NOT NULL DEFAULT 0,
	`totalPrice` int NOT NULL,
	`status` enum('pending','confirmed','preparing','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bouquetFlowers` ADD CONSTRAINT `bouquetFlowers_bouquetId_bouquets_id_fk` FOREIGN KEY (`bouquetId`) REFERENCES `bouquets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bouquetFlowers` ADD CONSTRAINT `bouquetFlowers_flowerId_flowers_id_fk` FOREIGN KEY (`flowerId`) REFERENCES `flowers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bouquets` ADD CONSTRAINT `bouquets_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cartItems` ADD CONSTRAINT `cartItems_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cartItems` ADD CONSTRAINT `cartItems_bouquetId_bouquets_id_fk` FOREIGN KEY (`bouquetId`) REFERENCES `bouquets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orderItems` ADD CONSTRAINT `orderItems_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orderItems` ADD CONSTRAINT `orderItems_bouquetId_bouquets_id_fk` FOREIGN KEY (`bouquetId`) REFERENCES `bouquets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;