import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import Express from "express";
import session from "express-session";
import "reflect-metadata";
import { formatArgumentValidationError } from 'type-graphql';
import { createConnection } from "typeorm";
import { createSchema } from './utils/createSchema';
import { redis } from "./redis";


const main = async () => {
  await createConnection();
  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    formatError: formatArgumentValidationError,
    context: ({req, res}: any) => ({req, res})
  })
  const app = Express();
  app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
  }));

  const RedisStore = connectRedis(session);
  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: "asd123",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );
  
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`Server started at localhost:4000`);
  })
}

main();