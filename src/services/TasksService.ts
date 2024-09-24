import { DataSource, Repository } from "typeorm";
import { TaskDto } from "../dto";
import { TaskRepository } from "../repositories";
import { Task } from "../modules";



export default class TaskService{
    private taskRepository: Repository<Task>;

    constructor(dataSource: DataSource){
        this.taskRepository = dataSource.getRepository(Task);
    }

    async getAllTask():Promise<Task[]>{
        try {
            return await this.taskRepository.find();
        } catch (error: any) {
            throw new Error(`Failed to retrieve tasks: ${error}`);
        }
    }

    async createTask(taskData:TaskDto):Promise<Task | string>{
        try{
            const task = this.taskRepository.create(taskData);
            return await this.taskRepository.save(task);
        }catch(error:any){
            throw new Error(`Failed to retrieve tasks: ${error}`);
        }
    }
}