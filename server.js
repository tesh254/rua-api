import express from "express";
import cors from "cors";
import morgan from "morgan";
import { graphqlHTTP } from "express-graphql";
import Playground from "graphql-playground-middleware-express";
import AWS from "aws-sdk";
import unzipper from "unzipper";
import { schema } from "./graphql";
import authChecker from "./middleware/auth";
import eventsAPI from "./routes/events";
import fs from "fs";
import zlib from "zlib";
import { simpleParser } from "mailparser";
import {
  getFileStream,
  emailFileToString,
  streamToFile,
  parseEmailFromFile,
  tmpCleanUp,
  s3CleanUp,
  s3Reupload,
} from "./s3_utils";

const app = express();

app.use(morgan("dev"));

app.use(cors());

app.use(express.json());

// app.use("/events", eventsAPI);

app.get(
  "/graphql",
  authChecker,
  graphqlHTTP((req) => ({
    schema: schema,
    context: {
      user: req.user,
    },
    graphiql: process.env.NODE_ENV === "development",
  }))
);

app.post(
  "/graphql",
  authChecker,
  graphqlHTTP((req) => ({
    schema: schema,
    context: {
      user: req.user,
    },
    graphiql: process.env.NODE_ENV === "development",
  }))
);

app.post("/event/new-email", async (req, res) => {
  const { s3_key, rcp } = req.body;

  try {
    const file_name = `${s3_key.split("/")[1].split(".")[0]}.txt`;
    await streamToFile(s3_key, file_name);

    const uploadResponse = await s3Reupload(rcp, file_name);

    await s3CleanUp(s3_key);

    await tmpCleanUp(file_name);

    res.send(uploadResponse);
  } catch (error) {
    console.log(error);
    res.send({
      message: "Email failed",
    });
  }
});

app.get("/playground", Playground({ endpoint: "/graphql" }));

app.listen(5000, (err) => {
  if (err) console.error(err);

  console.log(`Server is running on port: 5000`);
});

export default app;
