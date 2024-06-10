import { ApolloServer } from "@apollo/server";
import {expressMiddleware} from '@apollo/server/express4'
import express from 'express';
import bodyParser from "body-parser";
import cors from 'cors';
import { Data } from "./Data.js";
import { resolvers,typeDefs } from "./Graphql/Schema.js";

async function startServer() {
    const app = express()
    const server = new ApolloServer({typeDefs,resolvers});  

    app.use(bodyParser.json());
    app.use(cors());  

    await server.start();
    

    app.use('/graphql',expressMiddleware(server));

    app.listen(8000,()=>console.log('Server started 8000'));
} 

startServer()