import express from "express";
import cors from "cors";
import morgan from "morgan";
import { graphqlHTTP } from "express-graphql";
import Playground from "graphql-playground-middleware-express";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import unzipper from "unzipper";
import { schema } from "./graphql";
import authChecker from "./middleware/auth";
import eventsAPI from "./routes/events";
import validatorAPI from "./routes/validator";

dotenv.config();

const app = express();

app.use(morgan("dev"));

app.use(cors());

app.use(express.json());

app.use("/event", eventsAPI);

app.use("/check", validatorAPI);

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

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

app.set("PORT", process.env.PORT || 5555);

if (process.env.NODE_ENV === "development") {
  app.get("/playground", Playground({ endpoint: "/graphql" }));
}

app.listen(app.get("PORT"), (err) => {
  if (err) console.error(err);

  console.log(`Server is running on port: ${app.get("PORT")}`);
});

export default app;
