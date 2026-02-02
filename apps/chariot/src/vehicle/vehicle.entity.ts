import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VehicleType } from "@shared/vehicle-type.enum";
import { FuelType } from "@shared/fuel-type.enum";
import { User } from "../user/user.entity";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  vin: string;
  @Column()
  registrationNumber: string;
  @Column()
  make: string;
  @Column()
  model: string;
  @Column()
  year: number;
  @Column()
  initialMileage: number;
  @Column({
    type: "int",
  })
  vehicleType: VehicleType;
  @Column({
    type: "int",
  })
  fuelType: FuelType;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;
}
