CREATE TABLE `push_subscriptions` (
  `id` VARCHAR(191) NOT NULL, `endpoint` VARCHAR(512) NOT NULL, `p256dh` TEXT NOT NULL,
  `auth` TEXT NOT NULL, `userAgent` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `push_subscriptions_endpoint_key`(`endpoint`), PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
