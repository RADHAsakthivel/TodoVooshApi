import { Request, Response } from "express";
import { Delete, Get, Post, Put } from "../shared/decorators/http";
import { TaskDto } from "../modules/dto";
import { TaskService } from "../services";
import { Controller } from "../shared/decorators/controller";
import {
  BadRequestResponse,
  NotFoundResponse,
  SucessResponse,
} from "../shared/response/Response";
import { isUuid } from "../helper/validateUuid";

@Controller()
export class TaskController {
  private taskService: TaskService;
  constructor(_taskService: TaskService) {
    this.taskService = _taskService;
  }

  @Get("/tasks")
  async getAllTasks(req: Request, res: Response): Promise<any> {
    let tasks = await this.taskService.getAllTask();
    return res
      .status(200)
      .send(new SucessResponse("Fetch record sucessfully", tasks));
  }

  @Get("/task/:id")
  async getTask(req: Request, res: Response): Promise<any> {
    const id = req.params.id;
    if(!isUuid(id)) return res.status(400).send(new BadRequestResponse("Enter the proper uuid"))
    let task = await this.taskService.getTaskById(id);
    console.log("id =>",task)
    if (!task) {
      return res.status(404).send(new NotFoundResponse("Task not found"));
    }
    return res
      .status(200)
      .send(new SucessResponse("Fetch record sucessfully", task));
  }

  @Post("/task/create")
  async createTask(req: Request, res: Response): Promise<any> {
    if (!req.body)
      res
        .status(400)
        .send(new BadRequestResponse("Invalid request object", req.body));
    const response = await this.taskService.createTask(req.body);
    return res
      .status(200)
      .send(new SucessResponse("Sucessfully created the task", response));
  }

  @Delete("/task/delete/:id")
  async deleteTask(req: Request, res: Response): Promise<any> {
    const id = req.params.id;
    if(!isUuid(id)) return res.status(400).send(new BadRequestResponse("Id is not vaild it should be uuid"))
    const task = await this.taskService.getTaskById(id);
    if (!task) {
      res.status(404).send(new NotFoundResponse("Task not found"));
    }
    await this.taskService.deleteTask(id);
    return res
      .status(200)
      .send(new SucessResponse("Sucessfully deleted task", { id }));
  }

  @Put("/task/update")
  async updateTask(req: Request, res: Response): Promise<any> {
    const taskToUpdate = req.body;
    if(!isUuid(taskToUpdate.id)) return res.status(400).send(new BadRequestResponse("Id is not vaild it should be uuid"))
    const isTaskExist = await this.taskService.getTaskById(taskToUpdate.id);
    if (!isTaskExist)
      return res.status(404).send(new NotFoundResponse("Task not found"));
    const updatedTask = await this.taskService.updateTask(taskToUpdate);
    return res
      .status(200)
      .send(new SucessResponse("Sucessfully updated the task", updatedTask));
  }
}
