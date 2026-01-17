import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRefuelDto } from "./dto/create-refuel.dto";
import { UpdateRefuelDto } from "./dto/update-refuel.dto";
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
    userId: number,
    createRefuelDto: CreateRefuelDto,
  ): Promise<Refuel> {
    const vehicle = await this.vehicleService.findOne(
      createRefuelDto.vehicleId,
    );
    if (!vehicle || vehicle.userId !== userId) {
      throw new NotFoundException(`There is no such vehicle`);
    }
    return this.refuelsRepository.save({
      ...createRefuelDto,
    });
  }

  async findOne(id: number): Promise<Refuel> {
    const refuel = await this.refuelsRepository.findOne({
      where: { id },
    });
    if (!refuel) {
      throw new NotFoundException(`Refuel with id ${id} does not exist`);
    }
    return refuel;
  }

  async update(id: number, updateRefuelDto: UpdateRefuelDto): Promise<Refuel> {
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

  async remove(id: number): Promise<void> {
    await this.refuelsRepository.delete(id);
  }

  findAllForUser(userId: number): Promise<Refuel[]> {
    //return onlt reufuels without jointed vehicle data
    return this.refuelsRepository
      .createQueryBuilder("refuel")
      .leftJoin("refuel.Vehicle", "vehicle")
      .where("vehicle.userId = :userId", { userId })
      .getMany();
  }

  async findAllForVehicle(
    vehicleId: number,
    userId: number,
  ): Promise<Refuel[]> {
    const vehicle = await this.vehicleService.findOne(vehicleId);
    if (!vehicle || vehicle.userId !== userId) {
      throw new NotFoundException(`There is no such vehicle`);
    }
    return this.refuelsRepository.find({ where: { vehicleId } });
  }
}
