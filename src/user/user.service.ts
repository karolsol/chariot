import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  HASH_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async add(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.isAdmin = false;
    user.username = createUserDto.username;
    user.password = bcrypt.hashSync(createUserDto.password, this.HASH_ROUNDS);
    if (
      await this.usersRepository.find({
        where: { username: createUserDto.username },
      })
    ) {
      throw new ConflictException(
        "UserEntity with this username already exists",
      );
    }
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  update(id: number, updateUserDto: Partial<User>) {
    if (updateUserDto.password !== undefined) {
      updateUserDto.password = bcrypt.hashSync(
        updateUserDto.password,
        this.HASH_ROUNDS,
      );
    }
    return this.usersRepository.update(id, updateUserDto);
  }
}
