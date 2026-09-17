import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { VehicleService } from "./vehicle.service";
import { Vehicle } from "./vehicle.entity";
import { Refuel } from "../refuel/refuel.entity";
import { UserService } from "../user/user.service";
import { Mocked, vi } from "vitest";
import {
  CreateVehicleDto,
  FilterVehicleDto,
  FuelType,
  UpdateVehicleDto,
  VehicleType,
} from "@chariot/shared";
import { User } from "../user/user.entity";
import { createMockRepository } from "../common/mock-repository";

describe("VehicleService", () => {
  let service: VehicleService;
  let vehiclesRepository: Mocked<Repository<Vehicle>>;
  let refuelsRepository: Mocked<Repository<Refuel>>;
  let userService: Mocked<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: createMockRepository<Vehicle>(),
        },
        {
          provide: getRepositoryToken(Refuel),
          useValue: createMockRepository<Refuel>(),
        },
        { provide: UserService, useValue: { findOneById: vi.fn() } },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    vehiclesRepository = module.get(getRepositoryToken(Vehicle));
    refuelsRepository = module.get(getRepositoryToken(Refuel));
    userService = module.get(UserService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create and save a new vehicle", async () => {
      const userId = "user-123";
      const createDto: Partial<CreateVehicleDto> = {
        make: "Toyota",
        model: "Corolla",
      };
      const user = { id: userId, name: "John Doe" } as Partial<User>;
      const expectedVehicle = {
        id: "v-1",
        ...createDto,
        user,
      } as Partial<Vehicle>;

      userService.findOneById.mockResolvedValue(user as User);
      vehiclesRepository.create.mockReturnValue(expectedVehicle as Vehicle);
      vehiclesRepository.save.mockResolvedValue(expectedVehicle as Vehicle);

      const result = await service.create(
        userId,
        createDto as CreateVehicleDto,
      );

      expect(userService.findOneById).toHaveBeenCalledWith(userId);
      expect(vehiclesRepository.create).toHaveBeenCalledWith({
        ...createDto,
        user,
      });
      expect(vehiclesRepository.save).toHaveBeenCalledWith(expectedVehicle);
      expect(result).toEqual(expectedVehicle);
    });
  });

  describe("findOne", () => {
    it("should return a vehicle if found", async () => {
      const vehicle = { id: "v-1", brand: "BMW" } as Partial<Vehicle>;
      vehiclesRepository.findOne.mockResolvedValue(vehicle as Vehicle);

      const result = await service.findOne("v-1");

      expect(vehiclesRepository.findOne).toHaveBeenCalledWith({
        where: { id: "v-1" },
      });
      expect(result).toEqual(vehicle);
    });

    it("should throw NotFoundException if vehicle does not exist", async () => {
      vehiclesRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne("invalid-id")).rejects.toThrow(
        new NotFoundException("Vehicle with id invalid-id does not exist"),
      );
    });
  });

  describe("update", () => {
    it("should update and return the vehicle if it exists", async () => {
      const id = "v-1";
      const updateDto: Partial<UpdateVehicleDto> = { make: "Audi" };
      const existingVehicle: Partial<Vehicle> = { id, make: "BMW" };
      const updatedVehicle = { id, ...updateDto };

      vehiclesRepository.findOne.mockResolvedValue(existingVehicle as Vehicle);
      vehiclesRepository.save.mockResolvedValue(updatedVehicle as Vehicle);

      const result = await service.update(id, updateDto as UpdateVehicleDto);

      expect(vehiclesRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(vehiclesRepository.save).toHaveBeenCalledWith({
        ...updateDto,
        id,
      });
      expect(result).toEqual(updatedVehicle);
    });

    it("should throw NotFoundException if vehicle to update does not exist", async () => {
      vehiclesRepository.findOne.mockResolvedValue(null);

      await expect(service.update("invalid-id", {} as Vehicle)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("remove", () => {
    it("should call delete on repository", async () => {
      vehiclesRepository.delete.mockResolvedValue({ raw: null });

      await service.remove("v-1");

      expect(vehiclesRepository.delete).toHaveBeenCalledWith("v-1");
    });
  });

  describe("findAllForUser", () => {
    it("should find vehicles filtered by userId and optional filters", async () => {
      const userId = "user-123";
      const filterDto = {
        vehicleType: VehicleType.CAR,
        fuelType: FuelType.ELECTRIC,
      } as FilterVehicleDto;
      const vehicles = [{ id: "v-1" }, { id: "v-2" }];

      vehiclesRepository.find.mockResolvedValue(vehicles as Vehicle[]);

      const result = await service.findAllForUser(userId, filterDto);

      expect(vehiclesRepository.find).toHaveBeenCalledWith({
        where: {
          userId,
          vehicleType: VehicleType.CAR,
          fuelType: FuelType.ELECTRIC,
        },
      });
      expect(result).toEqual(vehicles);
    });

    it("should not include optional filters in query if undefined", async () => {
      const userId = "user-123";
      const filterDto = {} as FilterVehicleDto;

      vehiclesRepository.find.mockResolvedValue([]);

      await service.findAllForUser(userId, filterDto);

      expect(vehiclesRepository.find).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe("getStats", () => {
    it("should return empty stats if vehicle has no refuels", async () => {
      const vehicle = { id: "v-1", initialMileage: 1000 };
      vehiclesRepository.findOne.mockResolvedValue(vehicle as Vehicle);
      refuelsRepository.find.mockResolvedValue([]);

      const result = await service.getStats("v-1");

      expect(result).toEqual({
        averageConsumption: 0,
        maxConsumption: 0,
        minConsumption: 0,
        totalFuelUsed: 0,
        traveledDistance: 0,
        costPerKm: 0,
      });
    });

    it("should correctly calculate statistics when refuels exist", async () => {
      const vehicle = { id: "v-1", initialMileage: 1000 } as Partial<Vehicle>;
      const refuels = [
        { mileageAtRefuel: 1100, fuelAmount: 10, fuelPrice: 6 }, // +100 km, 10L, consumption 10L/100km, cost 60
        { mileageAtRefuel: 1300, fuelAmount: 15, fuelPrice: 6 }, // +200 km, 15L, consumption 7.5L/100km, cost 90
      ] as Partial<Refuel>[];

      vehiclesRepository.findOne.mockResolvedValue(vehicle as Vehicle);
      refuelsRepository.find.mockResolvedValue(refuels as Refuel[]);

      const result = await service.getStats("v-1");

      // fuel: 10 + 15 = 25
      // travelled: 1300 - 1000 = 300 km
      // consumption: [10, 7.5] -> evg: 8.75, max: 10, min: 7.5
      // cost: (60 + 90) / 300 = 150 / 300 = 0.5 money/km
      expect(result).toEqual({
        totalFuelUsed: 25,
        traveledDistance: 300,
        averageConsumption: 8.75,
        maxConsumption: 10,
        minConsumption: 7.5,
        costPerKm: 0.5,
      });
    });
  });
});
