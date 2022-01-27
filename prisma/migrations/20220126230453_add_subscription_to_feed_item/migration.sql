-- AlterTable
ALTER TABLE "Feed" ADD COLUMN     "subscription_id" TEXT;

-- AddForeignKey
ALTER TABLE "Feed" ADD CONSTRAINT "Feed_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
