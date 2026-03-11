import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public } from "./public.decorator";
import type { RequestWithUser } from "../common/request-with-user.interface";

@Controller("api/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post("login")
  login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post("refresh")
  refresh(@Body("refresh_token") refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Public()
  @Post("logout")
  async logout(@Body("refresh_token") refreshToken: string) {
    await this.authService.logout(refreshToken);
  }

  @Get("info")
  info(@Request() req: RequestWithUser) {
    return req.user;
  }
}
