import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRefuelDto, FilterDto } from "@chariot/shared";
import { UpdateRefuelDto } from "@chariot/shared";
import { Refuel } from "./refuel.entity";
import { VehicleService } from "../vehicle/vehicle.service";

@Injectable()
export class RefuelService {
  constructor(
    @InjectRepository(Refuel)
    private refuelsRepository: Repository<Refuel>,
    private readonly vehicleService: VehicleService,
  ) {}

  async create(
    userId: string,
    createRefuelDto: CreateRefuelDto,
  ): Promise<Refuel> {
    const newRefuel = this.refuelsRepository.create({
      ...createRefuelDto,
      vehicle: await this.vehicleService.findOne(createRefuelDto.vehicleId),
    });
    return this.refuelsRepository.save(newRefuel);
  }

  async findOne(id: string): Promise<Refuel> {
    const refuel = await this.refuelsRepository.findOne({
      where: { id },
    });
    if (!refuel) {
      throw new NotFoundException(`Refuel with id ${id} does not exist`);
    }
    return refuel;
  }

  async update(id: string, updateRefuelDto: UpdateRefuelDto): Promise<Refuel> {
    const refuel = await this.refuelsRepository.findOne({
      where: { id },
    });
    if (!refuel) {
      throw new NotFoundException(`Refuel with id ${id} does not exist`);
    }
    return this.refuelsRepository.save({
      ...updateRefuelDto,
      id: id,
    });
  }

  async remove(id: string): Promise<void> {
    await this.refuelsRepository.delete(id);
  }

  async findAllForUser(
    userId: string,
    filterDto: FilterDto,
  ): Promise<{ items: Refuel[]; total: number }> {
    const query = this.refuelsRepository
      .createQueryBuilder("refuel")
      .leftJoinAndSelect("refuel.vehicle", "vehicle")
      .where("vehicle.userId = :userId", { userId });

    if (filterDto.vehicleId !== undefined) {
      query.andWhere("vehicle.id = :vehicleId", {
        vehicleId: filterDto.vehicleId,
      });
    }
    if (filterDto.fromDate !== undefined) {
      query.andWhere("refuel.date >= :fromDate", {
        fromDate: new Date(filterDto.fromDate),
      });
    }

    if (filterDto.sortBy !== undefined && filterDto.sortOrder !== undefined) {
      const validColumns = this.refuelsRepository.metadata.columns.map(
        (col) => col.propertyName,
      );

      const targetSortField = validColumns.includes(filterDto.sortBy)
        ? filterDto.sortBy
        : "date";

      query.orderBy(
        `refuel.${targetSortField}`,
        filterDto.sortOrder.toUpperCase() as "ASC" | "DESC",
      );
    } else {
      query.orderBy("refuel.date", "DESC");
    }
    if (filterDto.page !== undefined && filterDto.limit !== undefined) {
      const skip = (filterDto.page - 1) * filterDto.limit;
      query.skip(skip).take(filterDto.limit);
    }

    const [data, total] = await query.getManyAndCount();

    return { items: data, total };
  }

  async findAllForVehicle(
    vehicleId: string,
    userId: string,
  ): Promise<Refuel[]> {
    const vehicle = await this.vehicleService.findOne(vehicleId);
    if (!vehicle || vehicle.userId !== userId) {
      throw new NotFoundException(`There is no such vehicle`);
    }
    return this.refuelsRepository.find({ where: { vehicleId } });
  }
}
