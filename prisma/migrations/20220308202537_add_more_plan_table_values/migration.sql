-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "cancel_url" TEXT,
ADD COLUMN     "checkout_id" TEXT,
ADD COLUMN     "last_event_time" TEXT,
ADD COLUMN     "last_receipt_url" TEXT,
ADD COLUMN     "next_bill_date" TEXT,
ADD COLUMN     "paddle_plan_id" TEXT,
ADD COLUMN     "paddle_subscription_payment_id" TEXT,
ADD COLUMN     "paddle_user_id" TEXT,
ADD COLUMN     "transaction_status" TEXT,
ADD COLUMN     "unit_price" INTEGER,
ADD COLUMN     "update_payment_url" TEXT;
