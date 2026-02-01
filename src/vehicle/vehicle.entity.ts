import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VehicleType } from "./vehicle-type.enum";
import { FuelType } from "../common/fuel-type.enum";
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
    type: "enum",
    enum: VehicleType,
  })
  vehicleType: VehicleType;
  @Column({
    type: "enum",
    enum: FuelType,
  })
  fuelType: FuelType;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "userId" })
  user: User;
}
