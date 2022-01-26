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
  enableReadyCheck: false
});

export const EmailQueue = new Queue("email-queue", { connection });

export const EmailQueueEvents = new QueueEvents("email-queue", { connection });
