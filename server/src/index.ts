import { MikroORM, RequiredEntityData } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
// import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  const fork = orm.em.fork();
  // await orm.getMigrator().createMigration();
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema();

  const app = express();

  const RedisStore = connectRedis(session);
  const { createClient } = require("redis");
  const redisClient = createClient({ legacyMode: true });
  redisClient.on("connect", () => console.log("Connected to Redis!"));
  redisClient.on("error", (err: any) => console.log("Redis Client Error", err));
  redisClient.connect();

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: !__prod__,
      },
      saveUninitialized: false,
      secret: "quiasdkjaksjdhajkhsdksjadh",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: fork, req, res }), // context passing for appollo server
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log("server started at localhost:4000");
  });
};

main().catch((err) => console.error(err));
