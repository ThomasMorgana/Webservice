/*
  Warnings:

  - You are about to drop the `Garage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cars` DROP FOREIGN KEY `cars_garageId_fkey`;

-- AlterTable
ALTER TABLE `cars` MODIFY `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NULL;

-- DropTable
DROP TABLE `Garage`;

-- CreateTable
CREATE TABLE `garages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `spaces` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cars` ADD CONSTRAINT `cars_garageId_fkey` FOREIGN KEY (`garageId`) REFERENCES `garages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
