/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `in_app_email` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "in_app_email" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "is_expired" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");
