import express from "express";
import cors from "cors";
import morgan from "morgan";
import { graphqlHTTP } from "express-graphql";
import Playground from "graphql-playground-middleware-express";
import { schema } from "./graphql";
import authChecker from "./middleware/auth";

const app = express();

app.use(morgan("dev"));

app.use(cors());

app.use(express.json());

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

app.post("/event/new-email", (req, res) => {
  console.log(req.body);
  res.send({
    message: "Email event received",
  });
});

app.get("/playground", Playground({ endpoint: "/graphql" }));

app.listen(5000, (err) => {
  if (err) console.error(err);

  console.log(`Server is running on port: 5000`);
});

export default app;
