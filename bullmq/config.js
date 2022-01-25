import { Queue, QueueEvents } from "bullmq";

export const EmailQueue = new Queue("email-queue", {
  host: process.env.RUA_REDIS_HOST,
  port: process.env.RUA_REDIS_PORT,
});

export const EmailQueueEvents = new QueueEvents("email-queue");
