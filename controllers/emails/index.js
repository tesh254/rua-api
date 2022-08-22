import { formatDistance } from "date-fns";
import { PrismaClient } from "@prisma/client";

import { EmailQueue as queue } from "../../bullmq/issue-handler";
import { ReminderQueue } from "../../bullmq/reminder-handler";

export async function addHarakaEventToQueue(payload) {
  await queue.add("new-email", payload);
}

const prisma = new PrismaClient();

export async function addReminderToQueue() {
  const users = await prisma.account.findMany();

  return new Promise((resolve, reject) => {
    let payload = [];
    users.forEach(async (user, idx) => {
      const feed = await prisma.feed.findMany({
        orderBy: {
          created_at: "desc",
        },
        where: {
          AND: [
            {
              account_id: user.id,
            },
            {
              is_read: false,
            },
          ],
        },
        include: {
          subscription: true,
        },
        take: 7,
      });

      if (feed.length > 0) {
        const result = feed.map((item) => {
          const issue = {
            title: item.title,
            creator: item.subscription.source_name,
            release_date: formatDistance(
              new Date(item.created_at),
              new Date(),
              {
                addSuffix: "true",
              }
            ),
          };

          return issue;
        });

        ReminderQueue.add("reminder",{
          email: user.email,
          issues: result,
        })
      }

      if (idx === users.length - 1) {
        resolve("okay");
      }
    });
  });
}