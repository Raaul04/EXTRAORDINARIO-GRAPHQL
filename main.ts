import { ApolloServer } from "@apollo/server";
import { schema } from "./schema.ts";
import {  } from "./types.ts";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";
import { MongoClient } from "mongodb";


const MONGO_URL = Deno.env.get('MONGO_URL');

if (!MONGO_URL) {
  throw new Error("La variable de entorno 'MONGO_URL' no está configurada");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();
console.info("Connected to MongoDB");


//const mongoDB = mongoClient.db("BD1");

/*const XXXCollection = mongoDB.collection<>("");*/

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ /*Collecion */ }),
});

console.info(`Server ready at ${url}`);