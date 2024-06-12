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
import { graphqlHTTP } from "express-graphql";
import { AppDataSource } from "./orm/ormconfig.js";
import 'reflect-metadata';
import { User } from './orm/entity/user-entity.js';
import { Product } from "./orm/entity/product-entity.js";

async function startServer() {
  const port = 8000;
  const app = express();

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({ schema });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  //   app.use("/graphql", expressMiddleware(server));

  //query for header authorization
  app.use(
    "/graphql",
    graphqlHTTP((req) => {
      return {
        schema,
        graphiql: { headerEditorEnabled: true },
        context: req.headers.authorization,
      };
    })
  );

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

AppDataSource.initialize().then(async()=>{
    console.log('Data Source has been initialized!');
     // Create a new user
     const user = new User();
     user.firstName = 'Riya';
     user.lastName = 'S';
     user.age = 25;

     const  product = new Product();
     product.name = 'apple';
     product.price = 100000;

     await AppDataSource.manager.save(product);

     await AppDataSource.manager.save(user);
     console.log('User has been saved:', user);
 
     //Retireve
     const users = await AppDataSource.manager.find(User);
     const products = await AppDataSource.manager.find(Product);
     console.log('All producrs:', products);
     console.log('All users:', users);

}).catch((err)=>console.log('Error Occured',err))
  // Start the HTTP server
  httpServer.listen(port, async() => {

    await AppDataSource;
    console.log("Server started on http://localhost:8000");
    console.log("Subscriptions ready at ws://localhost:8000/graphql");
  });
}

startServer();
