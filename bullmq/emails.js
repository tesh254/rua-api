import { PrismaClient } from "@prisma/client";
import { Worker } from "bullmq";
import AWS from "aws-sdk";
import unzipper from "unzipper";

import { EmailWorker as emailWorker } from "./config";

export const EmailWorker = new Worker(
  "email-queue",
  async (job) => {
    try {
      const {
        data: { rcp, s3_url, s3_key },
      } = job;

      AWS.config.update({
        accessKeyId: process.env.RUA_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.RUA_S3_SECRET_ACCESS_KEY,
        region: process.env.RUA_S3_REGION,
      });

      const s3 = new AWS.S3();

      const bucketName = process.env.RUA_S3_EMAIL_STORAGE_BUCKET;

      const s3Payload = {
        Bucket: bucketName,
        Key: s3_key,
      };

      const s3ReadStream = await s3
        .getObject(s3Payload)
        .createReadStream()
        .pipe(
          unzipper.ParseOne(`${s3_key.split(".")[1]}.1.eml.raw`, {
            forceStream: true,
          })
        );

      const s3ReadStreamBuffer = await new Promise((resolve, reject) => {
        const chunks = "";
        s3ReadStream.on("data", (chunk) => {
          chunks += chunk.toString();
        });
        s3ReadStream.on("end", () => {
          resolve(chunks);
        });
        s3ReadStream.on("error", (err) => {
          reject(err);
        });
      });

      s3ReadStreamBuffer.then(res => {
        console.log(res);
      })

    } catch (error) {
      throw error;
    }
  },
  {
    connection: {
      host: process.env.RUA_REDIS_HOST,
      port: process.env.RUA_REDIS_PORT,
    },
  }
);

emailWorker.on("progress", (job, progress) => {
  console.log(`Job ${job.id} is ${progress}% done`);
});

emailWorker.on("completed", (job, result) => {});

emailWorker.on("failed", (job, err) => {});
