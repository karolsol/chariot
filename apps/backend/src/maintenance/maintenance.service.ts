import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMaintenanceDto, FilterDto } from "@chariot/shared";
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

  async findAllForUser(
    userId: string,
    filterDto: FilterDto,
  ): Promise<{ items: Maintenance[]; total: number }> {
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

    if (filterDto.sortBy !== undefined && filterDto.sortOrder !== undefined) {
      const validColumns = this.maintenanceRepository.metadata.columns.map(
        (col) => col.propertyName,
      );

      const targetSortField = validColumns.includes(filterDto.sortBy)
        ? filterDto.sortBy
        : "date";

      query.orderBy(
        `maintenance.${targetSortField}`,
        filterDto.sortOrder.toUpperCase() as "ASC" | "DESC",
      );
    } else {
      query.orderBy("maintenance.date", "DESC");
    }
    if (filterDto.page !== undefined && filterDto.limit !== undefined) {
      const skip = (filterDto.page - 1) * filterDto.limit;
      query.skip(skip).take(filterDto.limit);
    }

    const [data, total] = await query.getManyAndCount();

    return { items: data, total };
  }

  async findAllForVehicle(vehicleId: string): Promise<Maintenance[]> {
    const vehicle = await this.vehicleService.findOne(vehicleId);
    if (!vehicle) {
      throw new NotFoundException(`There is no such vehicle`);
    }
    return this.maintenanceRepository.find({ where: { vehicleId } });
  }
}
