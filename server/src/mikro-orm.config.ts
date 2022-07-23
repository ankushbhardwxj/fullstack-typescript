import { Post } from "./entities/Post";
import { __prod__ } from "./constants";
// import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { MikroORM } from "@mikro-orm/core";
import { User } from "./entities/User";

export default {
  entities: [Post, User],
  dbName: "lireddit",
  type: "postgresql",
  password: "postgres",
  user: "postgres",
  debug: __prod__,
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
} as Parameters<typeof MikroORM.init>[0];
