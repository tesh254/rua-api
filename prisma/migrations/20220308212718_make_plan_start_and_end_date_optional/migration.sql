-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "price_start_date" DROP NOT NULL,
ALTER COLUMN "price_start_date" SET DATA TYPE TEXT,
ALTER COLUMN "price_end_date" DROP NOT NULL,
ALTER COLUMN "price_end_date" SET DATA TYPE TEXT;
