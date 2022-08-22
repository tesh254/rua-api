import { Queue, QueueEvents } from "bullmq";
import { PrismaClient } from "@prisma/client";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { streamToFile, tmpCleanUp, s3CleanUp, s3Reupload } from "../s3_utils";

// console.log({
//   host: process.env.RUA_REDIS_HOST,
//   port: process.env.RUA_REDIS_PORT,
// });

export const connection = new IORedis({
  host: process.env.RUA_REDIS_HOST,
  port: process.env.RUA_REDIS_PORT,
  password: process.env.RUA_REDIS_PASS,
  connectTimeout: 10000,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const prisma = new PrismaClient();

export const EmailQueue = new Queue("email-queue", { connection });

export const EmailDeleteQueue = new Queue("email-delete-queue", { connection });

export const EmailQueueEvents = new QueueEvents("email-queue", { connection });

export const EmailDeleteWorker = new Worker(
  "email-delete-queue",
  async (job) => {
    console.log("Handling job: ", job.id);

    const {
      data: { host_url },
    } = job;

    try {
      const [protocol, _, domain, folder, file_name] = host_url.split("/");

      await s3CleanUp(`${folder}/${file_name}`);

      return {
        status: "success",
        file: {
          source: `${protocol}://${domain}/${folder}/${file_name}`,
        },
      };
    } catch (error) {
      throw error;
    }
  },
  { connection }
);

export const EmailWorker = new Worker(
  "email-queue",
  async (job) => {
    console.log("Handling job: ", job.id);
    const {
      data: { rcp, s3_url, s3_key },
    } = job;
    try {
      // TODO: check if rcp email exists
      const account = await prisma.account.findFirst({
        where: {
          in_app_email: rcp,
        },
      });

      const file_name = `${s3_key.split("/")[1].split(".")[0]}.txt`;

      if (account && account.id) {
        await streamToFile(s3_key, file_name);

        const {
          s3_data: { Location },
          parsed_email,
        } = await s3Reupload(rcp, file_name);

        await s3CleanUp(s3_key);

        await tmpCleanUp(file_name);

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

          // TODO: add email to database
          await prisma.feed.create({
            data: {
              title: parsed_email.headers.subject || "No subject",
              feed_hosted_url: Location,
              is_read: false,
              is_hidden: false,
              account_id: account.id,
              subscription_id: newSub.id,
            },
          });

          await prisma.accountOnSubscriptions.create({
            data: {
              account_id: account.id,
              subscription_id: newSub.id,
            },
          });
        } else {
          // TODO: add email to database
          await prisma.feed.create({
            data: {
              title: parsed_email.headers.subject || "No subject",
              feed_hosted_url: Location,
              is_read: false,
              is_hidden: false,
              account_id: account.id,
              subscription_id: subscription.id,
            },
          });
        }

        return {
          message: "email processed",
          account_id: account.id,
        };
      } else {
        await s3CleanUp(s3_key);

        await tmpCleanUp(file_name);
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

EmailWorker.on("progress", (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% done`);
});

EmailWorker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result ${result.message}`);
});

EmailWorker.on("failed", (job, err) => {
  console.log(err);
  console.log(`Job ${job.id} failed with error ${err.message}`);
});

EmailDeleteWorker.on("progress", (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% done`);
});

EmailDeleteWorker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result ${result.message}`);

  job.remove();
});

EmailDeleteWorker.on("failed", (job, err) => {
  console.log(err);
  console.log(`Job ${job.id} failed with error ${err.message}`);
});
