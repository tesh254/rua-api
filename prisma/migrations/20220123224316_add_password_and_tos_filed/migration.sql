-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "has_accepted_tos" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "password" TEXT;
