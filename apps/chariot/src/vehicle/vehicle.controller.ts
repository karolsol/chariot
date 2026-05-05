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
import { VehicleService } from "./vehicle.service";
import { CreateVehicleDto } from "#shared/create-vehicle.dto";
import { UpdateVehicleDto } from "#shared/update-vehicle.dto";
import { Vehicle } from "./vehicle.entity";
import type { RequestWithUser } from "../common/request-with-user.interface";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { Action } from "../casl/casl-action.enum";
import { VehicleStatsDto } from "#shared/vehicle-stats.dto";

@Controller("api/vehicles")
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  findAll(@Request() req: RequestWithUser): Promise<Vehicle[]> {
    return this.vehicleService.findAllForUser(req.user.id);
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @Request() req: RequestWithUser,
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
    @Request() req: RequestWithUser,
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
    @Request() req: RequestWithUser,
  ): Promise<Vehicle> {
    return this.vehicleService.create(req.user.id, createVehicleDto);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id") id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
    @Request() req: RequestWithUser,
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
  async remove(@Param("id") id: string, @Request() req: RequestWithUser) {
    const vehicle = await this.vehicleService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!vehicle || !ability.can(Action.Delete, vehicle)) {
      throw new NotFoundException("There is no such vehicle");
    }
    return this.vehicleService.remove(id);
  }
}
