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
import { MaintenanceService } from "./maintenance.service";
import { CreateMaintenanceDto } from "#shared/create-maintenance.dto";
import { UpdateMaintenanceDto } from "#shared/update-maintenance.dto";
import { Maintenance } from "./maintenance.entity";
import type { RequestWithUser } from "../common/request-with-user.interface";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { Action } from "../casl/casl-action.enum";
import { VehicleService } from "../vehicle/vehicle.service";

@Controller("api/maintenances")
export class MaintenanceController {
  constructor(
    private readonly maintenanceService: MaintenanceService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly vehicleService: VehicleService,
  ) {}

  @Get()
  findAll(@Request() req: RequestWithUser): Promise<Maintenance[]> {
    return this.maintenanceService.findAllForUser(req.user.id);
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
    @Request() req: RequestWithUser,
  ): Promise<Maintenance> {
    const maintenance = await this.maintenanceService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!maintenance || !ability.can(Action.Read, maintenance)) {
      throw new NotFoundException("There is no such maintenance");
    }
    return this.maintenanceService.findOne(id);
  }

  @Get("/vehicle/:vehicleId")
  async findAllForVehicle(
    @Param("vehicleId") vehicleId: string,
    @Request() req: RequestWithUser,
  ) {
    const vehicle = await this.vehicleService.findOne(vehicleId);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!vehicle || !ability.can(Action.Read, vehicle)) {
      throw new NotFoundException("There is no such vehicle");
    }
    return this.maintenanceService.findAllForVehicle(vehicleId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createMaintenanceDto: CreateMaintenanceDto,
    @Request() req: RequestWithUser,
  ): Promise<Maintenance> {
    const vehicle = await this.vehicleService.findOne(
      createMaintenanceDto.vehicleId,
    );
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!vehicle || !ability.can(Action.Create, vehicle)) {
      throw new NotFoundException("There is no such vehicle");
    }
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Put(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id") id: string,
    @Body() updateMaintenanceDto: UpdateMaintenanceDto,
    @Request() req: RequestWithUser,
  ): Promise<Maintenance> {
    const maintenance = await this.maintenanceService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!maintenance || !ability.can(Action.Update, maintenance)) {
      throw new NotFoundException("There is no such maintenance");
    }
    return await this.maintenanceService.update(id, updateMaintenanceDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string, @Request() req: RequestWithUser) {
    const maintenance = await this.maintenanceService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!maintenance || !ability.can(Action.Delete, maintenance)) {
      throw new NotFoundException("There is no such maintenance");
    }
    return this.maintenanceService.remove(id);
  }
}
