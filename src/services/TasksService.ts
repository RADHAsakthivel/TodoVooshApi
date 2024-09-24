import { DataSource, Repository } from "typeorm";
import { TaskDto } from "../dto";
import { TaskRepository } from "../repositories";
import { Task } from "../modules";



export default class TaskService{
    private taskRepository: Repository<Task>;

    constructor(dataSource: DataSource){
        this.taskRepository = dataSource.getRepository(Task);
    }

    async createTask(taskData:TaskDto){
        try{
            const task = this.taskRepository.create(taskData);
            return await this.taskRepository.save(task);
        }catch(e:any){
            return "unable to create the user" + e;
        }
    }
}