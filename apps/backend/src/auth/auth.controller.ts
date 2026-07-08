import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public } from "./public.decorator";
import type { RequestWithUser } from "../common/request-with-user.interface";
import { jwtConstants } from "../config/jwt.config";

@Controller("api/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post("login")
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );

    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.SECURE === "production",
      sameSite: "strict",
      maxAge: jwtConstants.expiresIn,
    });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.SECURE === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: jwtConstants.refreshExpiresIn,
    });

    return { message: "Logged in successfully" };
  }

  @Public()
  @Post("refresh")
  async refresh(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies["refresh_token"];
    if (!refreshToken) throw new UnauthorizedException();

    const tokens = await this.authService.refresh(refreshToken);

    res.cookie("access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: jwtConstants.expiresIn,
    });
    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth/refresh",
      maxAge: jwtConstants.refreshExpiresIn,
    });

    return { message: "Tokens refreshed" };
  }

  @Public()
  @Post("logout")
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies["refresh_token"];
    await this.authService.logout(refreshToken);

    res.clearCookie("access_token");
    res.clearCookie("refresh_token", { path: "/api/auth/refresh" });
    return { message: "Logged out" };
  }

  @Get("info")
  info(@Req() req: RequestWithUser) {
    return req.user;
  }
}
