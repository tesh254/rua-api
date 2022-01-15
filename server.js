import express from "express";
import cors from "cors";
import morgan from "morgan";
import { SMTPServer } from "smtp-server";
import { simpleParser as parser } from "mailparser";
import axios from "axios";

const app = express();

app.use(morgan("combined"));

app.use(cors());

app.use(express.json());

app.listen(4000, (err) => {
  if (err) console.error(err);

  console.log(`Server is running on port: 4000`);
});

const emailServer = new SMTPServer({
  onData(stream, session, callback) {
    parser(stream, {}, (err, parsed) => {
      if (err) {
        console.error("Error: ", err);
      }

      axios
        .post("https://d624-41-90-66-234.ngrok.io/emails", parsed)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      stream.on("end", callback);
    });
  },
  disabledCommands: ['AUTH']
});

emailServer.listen(25, "18.185.110.231");
