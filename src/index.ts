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
  Game: {
    reviews: (parent) => db.reviews.filter((x) => x.game_id === parent.id),
  },
  Review: {
    game: (parent) => db.games.find((x) => x.id === parent.game_id),
    author: (parent) => db.authors.find((x) => x.id === parent.author_id),
  },
  Author: {
    reviews: (parent) => db.reviews.filter((x) => x.author_id === parent.id),
  },
  Mutation: {
    addGame: (_, args) => {
      const game = {
        id: Math.floor(Math.random() * 10000).toString(),
        ...args.game,
      };
      db.games.push(game);
      return game;
    },
    deleteGame: (_, args) => {
      db.games = db.games.filter((x) => x.id !== args.id);
      return db.games;
    },
    updateGame: (_, args) => {
      db.games = db.games.map((x) =>
        x.id === args.id ? { ...x, ...args.edits } : x,
      );
      return db.games.find((x) => x.id === args.id);
    },
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
