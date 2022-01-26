import express from "express";
import { addHarakaEventToQueue } from "../../controllers/emails";

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

export default router;
