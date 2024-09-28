import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import { DataSource } from "typeorm";
import cookieSession from "cookie-session";
import { Route } from "./configuration/routers";
import { TaskService, LoginService } from "./services";
import { passPortConfig } from "./configuration/passport";
import { intializeDatabase } from "./configuration/connectDB";
import { TaskController, LoginController } from "./controllers";
import { ServiceBuilder } from "./configuration/serviceContainer";

dotenv.config();
const dbUrl = process.env.TODO_SQL_URL?.toString() as string;
const port = process.env.TODO_PORT || 3000;
const corsurl = process.env.TODO_CORS_ORIGIN || "*";
const cookieSessionKey = process.env.TODO_COOKIES_SESSION_KEY as string;
const app = express();
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: [cookieSessionKey],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: corsurl,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

process.on("uncaughtException", (error) => {
  console.error("Internal server", error);
});

intializeDatabase(dbUrl)
  .then((dbContext) => {
    passPortConfig(dbContext);
    const service = new ServiceBuilder(dbContext as DataSource);

    service.initializeService<LoginService>(LoginService);
    service.initializeService<TaskService>(TaskService);

    const router = new Route(app, service.getServiceContainer());
    router.bindRoutes(LoginController);
    router.bindRoutes(TaskController);

    app.listen(port, () => {
      return console.log(`Express is listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize the database", error);
    process.exit(1);
  });
