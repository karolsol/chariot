import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateVehicleDto } from "@chariot/shared";
import { UpdateVehicleDto } from "@chariot/shared";
import { Vehicle } from "./vehicle.entity";
import { UserService } from "../user/user.service";
import { VehicleStatsDto } from "@chariot/shared";
import { Refuel } from "../refuel/refuel.entity";

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(Refuel)
    private refuelsRepository: Repository<Refuel>,
    private readonly userService: UserService,
  ) {}

  async create(
    userId: string,
    createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    const newVehicle = this.vehiclesRepository.create({
      ...createVehicleDto,
      user: await this.userService.findOneById(userId),
    });
    return this.vehiclesRepository.save(newVehicle);
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} does not exist`);
    }
    return vehicle;
  }

  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id: id },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} does not exist`);
    }
    return this.vehiclesRepository.save({
      ...updateVehicleDto,
      id: id,
    });
  }

  async remove(id: string): Promise<void> {
    await this.vehiclesRepository.delete(id);
  }

  findAllForUser(userId: string): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({
      where: { userId: userId },
    });
  }

  async getStats(vehicleId: string): Promise<VehicleStatsDto> {
    const vehicle = await this.findOne(vehicleId);
    const refuels = await this.refuelsRepository.find({
      where: { vehicleId },
      order: { mileageAtRefuel: "ASC" },
    });

    const dto: VehicleStatsDto = {
      averageConsumption: 0,
      maxConsumption: 0,
      minConsumption: 0,
      totalFuelUsed: 0,
      traveledDistance: 0,
      costPerKm: 0,
    };

    if (!refuels || refuels.length === 0) {
      return dto;
    }

    let totalFuel = 0;
    let totalCost = 0;
    for (const r of refuels) {
      totalFuel += r.fuelAmount;
      totalCost += r.fuelAmount * r.fuelPrice;
    }

    const consumptions: number[] = [];
    let prevMileage = vehicle.initialMileage ?? refuels[0].mileageAtRefuel;
    for (const r of refuels) {
      const distance = r.mileageAtRefuel - prevMileage;
      if (distance > 0) {
        const consumption = (r.fuelAmount / distance) * 100;
        consumptions.push(consumption);
      }
      prevMileage = r.mileageAtRefuel;
    }

    const lastMileage = Math.max(prevMileage, vehicle.initialMileage ?? 0);
    const traveled = lastMileage - (vehicle.initialMileage ?? lastMileage);

    dto.totalFuelUsed = Number(totalFuel.toFixed(2));
    dto.traveledDistance = traveled > 0 ? Number(traveled.toFixed(2)) : 0;

    if (consumptions.length > 0) {
      const sum = consumptions.reduce((a, b) => a + b, 0);
      dto.averageConsumption = Number((sum / consumptions.length).toFixed(2));
      dto.maxConsumption = Number(Math.max(...consumptions).toFixed(2));
      dto.minConsumption = Number(Math.min(...consumptions).toFixed(2));
    }

    dto.costPerKm =
      dto.traveledDistance > 0
        ? Number((totalCost / dto.traveledDistance).toFixed(2))
        : 0;

    return dto;
  }
}
