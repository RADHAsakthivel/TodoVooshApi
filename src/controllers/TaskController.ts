import { Request, Response } from "express";
import { Get, Post } from "../decorators/http";
import { TaskDto } from "../dto";
import TaskService from "../services/TasksService";
import {Controller} from "../decorators/controller"

@Controller()
export default class TaskController {
  private taskService: TaskService;
  constructor(_taskService: TaskService) {
    this.taskService = _taskService;
  }

  @Get("/tasks")
  async getAllTasks(req: Request, res: Response):Promise<any> {
    let Tasks = await this.taskService.getAllTask();
    return res.send(Tasks).status(200);
  }

  @Post("/task/create")
  async createTask(req: Request, res: Response): Promise<any> {
    if(!req.body) res.send("Invalid request object").status(400);
    const response = await this.taskService.createTask(req.body);
    return res.send(response).status(200);
  }
}
