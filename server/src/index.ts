import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Data } from "./Data.js";
import { subscribe, execute } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { resolvers, typeDefs } from "./Graphql/Schema.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { createServer } from "http";

async function startServer() {
  const port = 8000;
  const app = express();
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({ schema });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  const httpServer = createServer(app);


  //Setup subscription websocket for handling graphql
  SubscriptionServer.create(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server: httpServer,
      path: "/graphql",
    }
  );
  // Start the HTTP server
  httpServer.listen(port, () => {
    console.log("Server started on http://localhost:8000");
    console.log("Subscriptions ready at ws://localhost:8000/graphql");
  });
}

startServer();
