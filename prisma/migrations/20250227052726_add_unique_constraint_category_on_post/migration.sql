/*
  Warnings:

  - A unique constraint covering the columns `[post_id,category_id]` on the table `CategoryOnPost` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CategoryOnPost_post_id_category_id_key` ON `CategoryOnPost`(`post_id`, `category_id`);
