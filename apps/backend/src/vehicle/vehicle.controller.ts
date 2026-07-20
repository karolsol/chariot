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
  Query,
  Req,
} from "@nestjs/common";
import { VehicleService } from "./vehicle.service";
import { CreateVehicleDto } from "@chariot/shared";
import { UpdateVehicleDto } from "@chariot/shared";
import { Vehicle } from "./vehicle.entity";
import type { RequestWithUser } from "../common/request-with-user.interface";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { Action } from "../casl/casl-action.enum";
import { VehicleStatsDto } from "@chariot/shared";
import { FilterVehicle } from "@chariot/shared";

@Controller("api/vehicles")
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  findAll(
    @Req() req: RequestWithUser,
    @Query() filterDto: FilterVehicle,
  ): Promise<Vehicle[]> {
    return this.vehicleService.findAllForUser(req.user.id, filterDto);
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @Req() req: RequestWithUser,
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!vehicle || !ability.can(Action.Read, vehicle)) {
      throw new NotFoundException("There is no such vehicle");
    }
    return this.vehicleService.findOne(id);
  }

  @Get("stats/:id")
  async getStats(
    @Param("id") id: string,
    @Req() req: RequestWithUser,
  ): Promise<VehicleStatsDto> {
    const vehicle = await this.vehicleService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!vehicle || !ability.can(Action.Read, vehicle)) {
      throw new NotFoundException("There is no such vehicle");
    }
    return this.vehicleService.getStats(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createVehicleDto: CreateVehicleDto,
    @Req() req: RequestWithUser,
  ): Promise<Vehicle> {
    return this.vehicleService.create(req.user.id, createVehicleDto);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id") id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Req() req: RequestWithUser,
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!vehicle || !ability.can(Action.Update, vehicle)) {
      throw new NotFoundException("There is no such vehicle");
    }
    return await this.vehicleService.update(id, updateVehicleDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string, @Req() req: RequestWithUser) {
    const vehicle = await this.vehicleService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!vehicle || !ability.can(Action.Delete, vehicle)) {
      throw new NotFoundException("There is no such vehicle");
    }
    return this.vehicleService.remove(id);
  }
}
