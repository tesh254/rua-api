/*
  Warnings:

  - Made the column `created_at` on table `Account` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Account` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `AccountOnSubscriptions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `AccountOnSubscriptions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Feed` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Feed` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Highlight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Highlight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `Subscriptions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Subscriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "AccountOnSubscriptions" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Feed" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Highlight" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "Subscriptions" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;
