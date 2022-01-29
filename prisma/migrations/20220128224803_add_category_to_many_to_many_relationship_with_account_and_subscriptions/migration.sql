/*
  Warnings:

  - You are about to drop the column `category_id` on the `Subscriptions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_category_id_fkey";

-- AlterTable
ALTER TABLE "AccountOnSubscriptions" ADD COLUMN     "category_id" TEXT;

-- AlterTable
ALTER TABLE "Subscriptions" DROP COLUMN "category_id";

-- AddForeignKey
ALTER TABLE "AccountOnSubscriptions" ADD CONSTRAINT "AccountOnSubscriptions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
