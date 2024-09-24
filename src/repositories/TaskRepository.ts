import { Repository } from "typeorm";
import { Task } from "../modules";


export class TaskRepository extends Repository<Task> {
  async findAllUsers(): Promise<Task[]> {
    return this.find();
  }

  async findUserById(id: string): Promise<Task | null> {
    return this.findOne({ where: { id } });
  }

  async createUser(user: Task): Promise<Task> {
    return this.save(user);
  }

  async updateUser(id: string, user: Task): Promise<Task> {
    const existingUser = await this.findUserById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    return this.save({ ...existingUser, ...user });
  }

  async deleteUser(id: string): Promise<void> {
    const existingUser = await this.findUserById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }
    await this.delete(id);
  }
}

// export const UserRepository = dataSource.getRepository(User)
