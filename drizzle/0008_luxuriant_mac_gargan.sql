CREATE TABLE `blogPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`coverImageUrl` text,
	`category` enum('langage-des-fleurs','conseils','tendances','histoire','diy') NOT NULL,
	`tags` text,
	`authorName` varchar(200) NOT NULL DEFAULT 'Ananas Garden',
	`readTime` int NOT NULL DEFAULT 5,
	`isPublished` int NOT NULL DEFAULT 1,
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blogPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogPosts_slug_unique` UNIQUE(`slug`)
);
