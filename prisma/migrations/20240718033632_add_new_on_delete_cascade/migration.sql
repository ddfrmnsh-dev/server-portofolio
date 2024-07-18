-- DropForeignKey
ALTER TABLE `categoryonpost` DROP FOREIGN KEY `CategoryOnPost_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `categoryonpost` DROP FOREIGN KEY `CategoryOnPost_postId_fkey`;

-- AddForeignKey
ALTER TABLE `CategoryOnPost` ADD CONSTRAINT `CategoryOnPost_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryOnPost` ADD CONSTRAINT `CategoryOnPost_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
