import * as kf from "kafkajs";
import { sendEmail } from "../services/email";
import { generateReminderEmailTemplate } from "../templates/reminder";

const kafka = new kf.Kafka({
  brokers: ["large-spider-8355-us1-kafka.upstash.io:9092"],
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
  ssl: true,
});

export async function sendReminder(payload) {
  const producer = kafka.producer();

  await producer.connect();
  await producer.send({
    topic: "rua-reminders",
    messages: payload,
  });

  await producer.disconnect();
}

export async function reminderConsumer() {
  let consumer;

  try {
    consumer = kafka.consumer({ groupId: "reminder-consumer", retry: 10 });

    await consumer.connect();
    await consumer.subscribe({ topic: "rua-reminders", fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        const html = generateReminderEmailTemplate(
          JSON.parse(message.value).issues
        );

        const result = await sendEmail(
          _,
          JSON.parse(message.value).email,
          "Rua Alert",
          "You have some unread newsletter issues, login to Rua to read them",
          html.html
        );
        // resolveOffset(message.offset);
        await heartbeat();
      },
    });
  } catch (error) {
    throw {
      error,
      consumer,
    };
  }
}
