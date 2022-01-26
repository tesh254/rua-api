import { Queue, QueueEvents } from "bullmq";
import { PrismaClient } from "@prisma/client";
import { Worker } from "bullmq";
import { streamToFile, tmpCleanUp, s3CleanUp, s3Reupload } from "../s3_utils";
import { connection } from "./config";

const prisma = new PrismaClient();

export const EmailWorker = new Worker(
  "email-queue",
  async (job) => {
    const {
      data: { rcp, s3_url, s3_key },
    } = job;
    try {
      const file_name = `${s3_key.split("/")[1].split(".")[0]}.txt`;
      await streamToFile(s3_key, file_name);

      const {
        s3_data: { Location },
        parsed_email,
      } = await s3Reupload(rcp, file_name);

      await s3CleanUp(s3_key);

      await tmpCleanUp(file_name);

      // TODO: check if rcp email exists
      const account = await prisma.account.findFirst({
        where: {
          in_app_email: rcp,
        },
      });

      if (account && account.id) {
        // TODO: add email to database
        await prisma.feed.create({
          data: {
            title: parsed_email.headers.subject || "No subject",
            feed_hosted_url: Location,
            is_read: false,
            is_hidden: false,
            account_id: account.id,
          },
        });

        // TODO: create/update subscription
        const subscription = await prisma.subscriptions.findFirst({
          where: {
            source_email: parsed_email.from.value[0].address,
          },
        });

        if (!subscription) {
          // TODO: create explicit rlship between subscription and feed
          const newSub = await prisma.subscriptions.create({
            data: {
              source_email: parsed_email.from.value[0].address,
              source_name: parsed_email.from.value[0].name,
              platform_domain: parsed_email.from.value[0].address.split("@")[1],
              source_avatar: `https://img.buymeacoffee.com/api/?name=${parsed_email.from.value[0].name
                .split(" ")
                .join(
                  "+"
                )}&background=ffffff&color=000000&rounded=true&bold=true&uppercase=true`,
            },
          });

          await prisma.accountOnSubscriptions.create({
            data: {
              account_id: account.id,
              subscription_id: newSub.id,
            },
          });
        }

        return {
          message: "email processed",
          account_id: account.id,
        };
      } else {
        return {
          message: "account not found",
        };
      }
    } catch (error) {
      throw error;
    }
  },
  {
    connection,
  }
);

EmailQueue.on("progress", (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% done`);
});

EmailQueue.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result ${result}`);
});

EmailQueue.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error ${err}`);
});
