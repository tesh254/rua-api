/*
  Warnings:

  - You are about to drop the column `category_id` on the `Feed` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Feed" DROP CONSTRAINT "Feed_category_id_fkey";

-- AlterTable
ALTER TABLE "Feed" DROP COLUMN "category_id";
