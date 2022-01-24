/*
  Warnings:

  - You are about to drop the column `name` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `name_slug` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "name",
DROP COLUMN "name_slug";
