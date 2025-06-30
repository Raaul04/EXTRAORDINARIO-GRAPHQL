import { ApolloServer } from "@apollo/server";
import { schema } from "./schema.ts";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.ts";
import { Collection } from "mongodb";
import { Character } from "./types.ts";


const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server,{});

console.info(`Server ready at ${url}`);