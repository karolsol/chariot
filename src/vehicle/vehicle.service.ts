import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";
import { Vehicle } from "./vehicle.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    private readonly userService: UserService,
  ) {}

  async create(
    userId: number,
    createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehiclesRepository.save({
      ...createVehicleDto,
      user: await this.userService.findOneById(userId),
    });
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} does not exist`);
    }
    return vehicle;
  }

  async update(
    id: number,
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

  async remove(id: number): Promise<void> {
    await this.vehiclesRepository.delete(id);
  }

  findAllForUser(userId: number): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({
      where: { userId: userId },
    });
  }
}
