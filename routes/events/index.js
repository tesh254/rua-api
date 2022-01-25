import express from "express";
import { addHarakaEventToQueue } from "../../controllers/emails";

const router = express.Router();

router.post(`/new-email`, (req, res, next) => {
  const payload = req.body;

  addHarakaEventToQueue(payload)
    .then(() => {
      res.status(200).json({
        message: "Email event received",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Error adding email event to queue",
      });
    });
});

export default router;
