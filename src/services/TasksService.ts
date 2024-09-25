import { DataSource, Repository } from "typeorm";
import { TaskDto } from "../modules/dto";
import { Task } from "../modules/Entity";
import { NotFoundException } from "../shared/CustomErrors";

export class TaskService {
  private taskRepository: Repository<Task>;

  constructor(dataSource: DataSource) {
    this.taskRepository = dataSource.getRepository(Task);
  }

  async getAllTask(): Promise<Task[]> {
    try {
      return await this.taskRepository.find();
    } catch (error: any) {
      throw new Error(`Failed to retrieve tasks: ${error}`);
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      return await this.taskRepository.findOne({ where: { id } });
    } catch (error: any) {
      throw new Error(`Failed to retrieve task: ${error}`);
    }
  }

  async createTask(taskData: TaskDto): Promise<Task | string> {
    try {
      const task = this.taskRepository.create(taskData);
      return await this.taskRepository.save(task);
    } catch (error: any) {
      throw new Error(`Failed to create tasks: ${error}`);
    }
  }

  async updateTask(taskData: TaskDto): Promise<Task | string> {
    try {
      const task = await this.taskRepository.findOne({
        where: {
          id: taskData.id,
        },
      });
      if (!task) {
        throw new NotFoundException(`No task found`);
      }
      task.title = taskData.title;
      task.description = taskData.description;
      return await this.taskRepository.save(task);
    } catch (error: any) {
      throw new Error(`Failed to update tasks: ${error}`);
    }
  }

  async deleteTask(id: string): Promise<any> {
    try {
      await this.taskRepository
        .createQueryBuilder()
        .delete()
        .from(Task)
        .where("id = :id", { id })
        .execute();
      return;
    } catch (error: any) {
      throw new Error(`Failed to delete tasks: ${error}`);
    }
  }
}
