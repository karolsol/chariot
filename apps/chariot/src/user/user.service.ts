import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "@shared/create-user.dto";
import { UpdateUserDto } from "@shared/update-user.dto";
import { PasswordHashingService } from "../common/password-hashing.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private passwordHashingService: PasswordHashingService,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with this is does not exist`);
    } else {
      return user;
    }
  }

  findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async add(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.isAdmin = false;
    user.username = createUserDto.username;
    user.password = this.passwordHashingService.hashPassword(
      createUserDto.password,
    );
    if (
      await this.usersRepository.exists({
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

  update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password !== undefined) {
      updateUserDto.password = this.passwordHashingService.hashPassword(
        updateUserDto.password,
      );
    }
    return this.usersRepository.update(id, updateUserDto);
  }
}
