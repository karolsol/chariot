import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMaintenanceDto } from "@shared/shared/create-maintenance.dto";
import { UpdateMaintenanceDto } from "@shared/shared/update-maintenance.dto";
import { Maintenance } from "./maintenance.entity";
import { VehicleService } from "../vehicle/vehicle.service";

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Maintenance)
    private maintenanceRepository: Repository<Maintenance>,
    private readonly vehicleService: VehicleService,
  ) {}

  async create(
    createMaintenanceDto: CreateMaintenanceDto,
  ): Promise<Maintenance> {
    const vehicle = await this.vehicleService.findOne(
      createMaintenanceDto.vehicleId,
    );
    if (!vehicle) {
      throw new NotFoundException(`There is no such vehicle`);
    }
    return this.maintenanceRepository.save({
      ...createMaintenanceDto,
    });
  }

  async findOne(id: number): Promise<Maintenance> {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { id },
    });
    if (!maintenance) {
      throw new NotFoundException(`Maintenance with id ${id} does not exist`);
    }
    return maintenance;
  }

  async update(
    id: number,
    updateMaintenanceDto: UpdateMaintenanceDto,
  ): Promise<Maintenance> {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { id },
    });
    if (!maintenance) {
      throw new NotFoundException(`Maintenance with id ${id} does not exist`);
    }
    return this.maintenanceRepository.save({
      ...updateMaintenanceDto,
      id: id,
    });
  }

  async remove(id: number): Promise<void> {
    await this.maintenanceRepository.delete(id);
  }

  findAllForUser(userId: number): Promise<Maintenance[]> {
    return this.maintenanceRepository
      .createQueryBuilder("maintenance")
      .leftJoinAndSelect("maintenance.Vehicle", "vehicle")
      .where("vehicle.userId = :userId", { userId })
      .getMany();
  }

  async findAllForVehicle(vehicleId: number): Promise<Maintenance[]> {
    const vehicle = await this.vehicleService.findOne(vehicleId);
    if (!vehicle) {
      throw new NotFoundException(`There is no such vehicle`);
    }
    return this.maintenanceRepository.find({ where: { vehicleId } });
  }
}
