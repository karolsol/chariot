import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMaintenanceDto, FilterMaintenanceDto } from "@chariot/shared";
import { UpdateMaintenanceDto } from "@chariot/shared";
import { Maintenance } from "./maintenance.entity";
import { VehicleService } from "../vehicle/vehicle.service";
import { UserService } from "../user/user.service";

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(Maintenance)
    private maintenanceRepository: Repository<Maintenance>,
    private vehicleService: VehicleService,
    private userService: UserService,
  ) {}

  async create(
    userId: string,
    createMaintenanceDto: CreateMaintenanceDto,
  ): Promise<Maintenance> {
    const newMaintenance = this.maintenanceRepository.create({
      ...createMaintenanceDto,
      user: await this.userService.findOneById(userId),
    });
    return this.maintenanceRepository.save(newMaintenance);
  }

  async findOne(id: string): Promise<Maintenance> {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { id },
    });
    if (!maintenance) {
      throw new NotFoundException(`Maintenance with id ${id} does not exist`);
    }
    return maintenance;
  }

  async update(
    id: string,
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

  async remove(id: string): Promise<void> {
    await this.maintenanceRepository.delete(id);
  }

  findAllForUser(
    userId: string,
    filterDto: FilterMaintenanceDto,
  ): Promise<Maintenance[]> {
    const query = this.maintenanceRepository
      .createQueryBuilder("maintenance")
      .leftJoinAndSelect("maintenance.vehicle", "vehicle")
      .where("vehicle.userId = :userId", { userId });

    if (filterDto.vehicleId !== undefined) {
      query.andWhere("vehicle.id = :vehicleId", {
        vehicleId: filterDto.vehicleId,
      });
    }
    if (filterDto.fromDate !== undefined) {
      query.andWhere("maintenance.date >= :fromDate", {
        fromDate: new Date(filterDto.fromDate),
      });
    }

    return query.getMany();
  }

  async findAllForVehicle(vehicleId: string): Promise<Maintenance[]> {
    const vehicle = await this.vehicleService.findOne(vehicleId);
    if (!vehicle) {
      throw new NotFoundException(`There is no such vehicle`);
    }
    return this.maintenanceRepository.find({ where: { vehicleId } });
  }
}
