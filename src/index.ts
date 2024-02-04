import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./scheme";
import db from "./_db";

const resolvers = {
  Query: {
    games: () => db.games,
    game: (_, args) => db.games.find((x) => x.id === args.id),
    reviews: () => db.reviews,
    review: (_, args) => db.reviews.find((x) => x.id === args.id),
    authors: () => db.authors,
    author: (_, args) => db.authors.find((x) => x.id === args.id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("Server ready at", url);
