import express from "express";
import cors from "cors";
import morgan from "morgan";
import { graphqlHTTP } from "express-graphql";
import Playground from "graphql-playground-middleware-express";
import { schema } from "./graphql";

const app = express();

app.use(morgan("combined"));

app.use(cors());

app.use(express.json());

app.use(
  "/graphql",
  // authChecker,
  graphqlHTTP((req) => ({
    schema,
    context: {
      user: req.user,
    },
    graphiql: process.env.NODE_ENV === "development",
  }))
);

app.get("/playground", Playground({ endpoint: "/graphql" }));

app.listen(4000, (err) => {
  if (err) console.error(err);

  console.log(`Server is running on port: 4000`);
});
