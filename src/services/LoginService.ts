import { DataSource, Repository } from "typeorm";
import { UserDto } from "../dto";
import { User } from "../modules";
import bcrypt from 'bcrypt';

export class LoginService {
  private taskRepository: Repository<User>;
  constructor(dataSource: DataSource) {
    this.taskRepository = dataSource.getRepository(User);
  }

  async createUser(user: UserDto):Promise<User> {
        const saltRounds = 10;
        const encryptPassWord = await bcrypt.hash(user.passWord,saltRounds);
        const createUser = this.taskRepository.create({
            ...user,
            passWord:encryptPassWord
        });
        return await this.taskRepository.save(createUser);
  }

  async findUser(user: UserDto){
    return await this.taskRepository.findOne({ where: { email: user.email } });
  }
}
