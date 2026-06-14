import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRefuelDto } from "@chariot/shared";
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

  findAllForUser(userId: string): Promise<Refuel[]> {
    return this.refuelsRepository
      .createQueryBuilder("refuel")
      .leftJoinAndSelect("refuel.vehicle", "vehicle")
      .where("vehicle.userId = :userId", { userId })
      .getMany();
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
