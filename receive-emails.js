const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());

app.use(express.json());

app.post(`/emails`, (req, res) => {
  const body = req.body;

  const rawData = fs.readFileSync("emails.json");
  let emails = JSON.parse(rawData);

  const new_emails = [...emails, body];

  fs.writeFileSync("emails.json", JSON.stringify(new_emails));

  res.status(200).json({
    is_success: true,
  });
});

app.listen(7888, (err) => {
  if (err) console.error(err);

  console.log("Server is running on port: 7888");
});
