import express from 'express';
import {LoginController} from "./controllers"
import { Route, Service } from './routers';
import { intializeDatabase } from './connectDB';import dotenv from 'dotenv';
import TaskController from './controllers/TaskController';
import { DataSource } from 'typeorm';
import TaskService from './services/TasksService';

  dotenv.config();
  const dbUrl = process.env.TODO_SQL_URL?.toString() as string;
  const port = process.env.TODO_PORT;
  const app = express();
  app.use(express.json());
  
  intializeDatabase(dbUrl)
    .then((dbContext)=>{
      const service = new Service(dbContext as DataSource)
      service.initializeService<TaskService>(TaskService);
      
      const router = new Route(app,service.getServiceContainer());
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