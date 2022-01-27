import express from "express";
import { checkIfEmailExist } from "../../controllers/validator";

const router = express.Router();

router.get("/check-email", (req, res, next) => {
  if (req.query.rua_mail) {
    const rcp_email = `${req.query.rua_mail}${process.env.RUA_EMAIL_BASE_DOMAIN}`;
    checkIfEmailExist(rcp_email).then((result) => {
      res.status(200).json({
        email_exists: result,
      });
    });
  } else {
    res.status(400).json({
      message: "Missing email",
    });
  }
});

export default router;