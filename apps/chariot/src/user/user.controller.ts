import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from "@nestjs/common";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Public } from "../auth/public.decorator";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { Action } from "../casl/casl-action.enum";
import type { RequestWithUser } from "../common/request-with-user.interface";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get(":id")
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<User | null> {
    const user = await this.userService.findOneById(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Read, user)) {
      throw new ForbiddenException("Access denied");
    }
    return user;
  }

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.add(createUserDto);
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ): Promise<User> {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const updatedUser = await this.userService.findOneById(id);
    if (!ability.can(Action.Update, updatedUser)) {
      throw new ForbiddenException("Access denied");
    }
    const result = await this.userService.update(id, updateUserDto);
    if (result.affected && result.affected > 0) {
      return await this.userService.findOneById(id);
    } else {
      throw new NotFoundException("There is no such user");
    }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const deletedUser = await this.userService.findOneById(id);
    if (!ability.can(Action.Delete, deletedUser)) {
      throw new ForbiddenException("Access denied");
    }
    await this.userService.remove(id);
  }
}
