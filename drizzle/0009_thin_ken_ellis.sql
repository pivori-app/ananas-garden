ALTER TABLE `orders` ADD `paymentMethod` enum('paypal','stripe','card');--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentStatus` enum('pending','completed','failed','refunded') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `orders` ADD `paypalOrderId` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `paypalPayerId` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `paypalPayerEmail` varchar(320);