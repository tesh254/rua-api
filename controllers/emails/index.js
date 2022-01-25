import { EmailQueue as queue } from "../../bullmq/config";

export async function addHarakaEventToQueue(payload) {
    await queue.add('new-email', payload);
}
