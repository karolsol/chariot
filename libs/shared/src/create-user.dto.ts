import { Allow } from "class-validator";

export class CreateUserDto {
  @Allow()
  username: string;
  @Allow()
  password: string;
}
