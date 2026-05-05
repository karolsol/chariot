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
  Request,
} from "@nestjs/common";
import { RefuelService } from "./refuel.service";
import { CreateRefuelDto } from "#shared/create-refuel.dto";
import { UpdateRefuelDto } from "#shared/update-refuel.dto";
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
  findAll(@Request() req: RequestWithUser): Promise<Refuel[]> {
    return this.refuelService.findAllForUser(req.user.id);
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @Request() req: RequestWithUser,
  ): Promise<Refuel> {
    const refuel = await this.refuelService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!refuel || !ability.can(Action.Read, refuel.Vehicle)) {
      throw new NotFoundException("There is no such refuel");
    }
    return this.refuelService.findOne(id);
  }

  @Get("/vehicle/:vehicleId")
  async findAllForVehicle(
    @Param("vehicleId") vehicleId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.refuelService.findAllForVehicle(vehicleId, req.user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createRefuelDto: CreateRefuelDto,
    @Request() req: RequestWithUser,
  ): Promise<Refuel> {
    return this.refuelService.create(req.user.id, createRefuelDto);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id") id: string,
    @Body() updateRefuelDto: UpdateRefuelDto,
    @Request() req: RequestWithUser,
  ): Promise<Refuel> {
    const refuel = await this.refuelService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!refuel || !ability.can(Action.Update, refuel.Vehicle)) {
      throw new NotFoundException("There is no such refuel");
    }
    return await this.refuelService.update(id, updateRefuelDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string, @Request() req: RequestWithUser) {
    const refuel = await this.refuelService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!refuel || !ability.can(Action.Delete, refuel.Vehicle)) {
      throw new NotFoundException("There is no such refuel");
    }
    return this.refuelService.remove(id);
  }
}
