import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from "@nestjs/common";
import { RefuelService } from "./refuel.service";
import { CreateRefuelDto } from "@chariot/shared";
import { UpdateRefuelDto } from "@chariot/shared";
import { Refuel } from "./refuel.entity";
import type { RequestWithUser } from "../common/request-with-user.interface";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { Action } from "../casl/casl-action.enum";

@Controller("api/refuels")
export class RefuelController {
  constructor(
    private readonly refuelService: RefuelService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  findAll(@Req() req: RequestWithUser): Promise<Refuel[]> {
    return this.refuelService.findAllForUser(req.user.id);
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @Req() req: RequestWithUser,
  ): Promise<Refuel> {
    const refuel = await this.refuelService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!refuel || !ability.can(Action.Read, refuel.vehicle)) {
      throw new NotFoundException("There is no such refuel");
    }
    return this.refuelService.findOne(id);
  }

  @Get("/vehicle/:vehicleId")
  async findAllForVehicle(
    @Param("vehicleId") vehicleId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.refuelService.findAllForVehicle(vehicleId, req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createRefuelDto: CreateRefuelDto,
    @Req() req: RequestWithUser,
  ): Promise<Refuel> {
    return this.refuelService.create(req.user.id, createRefuelDto);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id") id: string,
    @Body() updateRefuelDto: UpdateRefuelDto,
    @Req() req: RequestWithUser,
  ): Promise<Refuel> {
    const refuel = await this.refuelService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!refuel || !ability.can(Action.Update, refuel.vehicle)) {
      throw new NotFoundException("There is no such refuel");
    }
    return await this.refuelService.update(id, updateRefuelDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string, @Req() req: RequestWithUser) {
    const refuel = await this.refuelService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!refuel || !ability.can(Action.Delete, refuel.vehicle)) {
      throw new NotFoundException("There is no such refuel");
    }
    return this.refuelService.remove(id);
  }
}
