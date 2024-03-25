/*
  Warnings:

  - Added the required column `path_img` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `path_img` VARCHAR(191) NOT NULL;
