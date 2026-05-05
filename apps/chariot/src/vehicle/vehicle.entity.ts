import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { VehicleType } from "#shared/vehicle-type.enum";
import { FuelType } from "#shared/fuel-type.enum";
import { User } from "../user/user.entity";

@Entity()
export class Vehicle {
  @PrimaryColumn("uuid")
  id: string;
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
  userId: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;
}
