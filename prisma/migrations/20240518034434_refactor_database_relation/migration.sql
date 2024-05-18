/*
  Warnings:

  - You are about to drop the column `path_img` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `path_img` on the `project` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `path_img`,
    MODIFY `title` VARCHAR(191) NULL,
    MODIFY `content` TEXT NULL,
    MODIFY `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `project` DROP COLUMN `link`,
    DROP COLUMN `path_img`,
    ADD COLUMN `clientId` INTEGER NOT NULL,
    ADD COLUMN `link_website` VARCHAR(191) NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `slug` VARCHAR(191) NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `is_active` BOOLEAN NULL,
    ADD COLUMN `username` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `path_img` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `projectId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `path_logo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
