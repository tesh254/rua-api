import express from "express";
import {
  addHarakaEventToQueue,
  addReminderToQueue,
} from "../../controllers/emails";

const router = express.Router();

router.post("/new-email", async (req, res, next) => {
  addHarakaEventToQueue(req.body)
    .then(() => {
      res.status(200).json({
        message: "Email event received and is being processed",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Error adding email event to queue",
      });
    });
});

router.post("/reminders", (req, res, next) => {
  addReminderToQueue()
    .then((issues) => {
      res.status(200).json({
        message: "Reminders added to queue",
        handled: issues,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error adding reminders to queue",
      });
    });
});

export default router;
