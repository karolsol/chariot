import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/user.entity";
import { JwtPayload } from "./jwtPayload.interface";
import { PasswordHashingService } from "../common/password-hashing.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private passwordHashingService: PasswordHashingService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (
      user &&
      (await this.passwordHashingService.comparePassword(pass, user.password))
    ) {
      return user;
    }
    return null;
  }

  login(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      sub: String(user.id),
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
