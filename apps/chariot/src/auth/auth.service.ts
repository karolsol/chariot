import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { RefreshToken } from "./refresh-token.entity";
import { JwtPayload } from "./jwtPayload.interface";
import { PasswordHashingService } from "../common/password-hashing.service";
import { jwtConstants } from "../config/jwt.config";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private passwordHashingService: PasswordHashingService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
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

  async login(user: User) {
    const tokens = await this.generateTokens(user);
    return tokens;
  }

  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const userId = parseInt(payload.sub);

    const stored = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, userId },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("Refresh token expired or not found");
    }

    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    await this.refreshTokenRepository.remove(stored);

    return this.generateTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token: refreshToken });
  }

  private async generateTokens(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshTokenValue = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: jwtConstants.refreshExpiresIn,
    });

    const expiresAt = new Date(Date.now() + jwtConstants.refreshExpiresIn * 1000);

    const refreshTokenEntity = this.refreshTokenRepository.create({
      userId: user.id,
      token: refreshTokenValue,
      expiresAt,
    });
    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      access_token: accessToken,
      refresh_token: refreshTokenValue,
    };
  }
}
