import { DataSource, Repository } from "typeorm";
import { UserDto } from "../modules/dto";
import { User } from "../modules/Entity";
import bcrypt from "bcrypt";
import { CustomResponse } from "../shared/response/Response";

export class LoginService {
  private userRepository: Repository<User>;
  constructor(dataSource: DataSource) {
    this.userRepository = dataSource.getRepository(User);
  }

  async createUser(user: UserDto): Promise<User> {
    const saltRounds = 10;
    const encryptPassWord = await bcrypt.hash(user.passWord, saltRounds);
    const createUser = this.userRepository.create({
      ...user,
      passWord: encryptPassWord,
    });
    return await this.userRepository.save(createUser);
  }

  async findUser(user: UserDto): Promise<User | null> {
    const userData = await this.userRepository.findOne({
      where: { email: user.email },
    });
    return userData;
  }
}
