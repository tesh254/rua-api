import { Queue, QueueEvents } from "bullmq";
import { Worker } from "bullmq";

import { sendEmail } from "../services/email";
import { generateReminderEmailTemplate } from "../templates/reminder";
import { connection } from "./issue-handler";

export const ReminderQueue = new Queue("reminder-queue", { connection });

export const ReminderQueueEvents = new QueueEvents("reminder-queue", {
  connection,
});

export const ReminderWorker = new Worker("reminder-queue", async (job) => {
  const html = generateReminderEmailTemplate(job.data.issues);

  const response = await sendEmail(
    null,
    job.data.email,
    "New Issues",
    "Check rua inbox for new issues",
    html.html,
  );

  return JSON.stringify(response);
}, { connection });

ReminderWorker.on("progress", (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% done`);
});

ReminderWorker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result ${result}`);

  job.remove();
});

ReminderWorker.on("failed", (job, err) => {
  console.log({err});
  console.log(`Job ${job.id} failed with error ${err}`);
});
