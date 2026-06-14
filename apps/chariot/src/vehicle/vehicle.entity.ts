import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { IVehicle, VehicleType } from "@chariot/shared";
import { FuelType } from "@chariot/shared";
import { User } from "../user/user.entity";
import { v7 as uuidv7 } from "uuid";

@Entity()
export class Vehicle implements IVehicle{
  @PrimaryColumn("uuid")
  id!: string;
  @Column()
  vin!: string;
  @Column()
  registrationNumber!: string;
  @Column()
  make!: string;
  @Column()
  model!: string;
  @Column()
  year!: number;
  @Column()
  initialMileage!: number;
  @Column({
    type: "int",
  })
  vehicleType!: VehicleType;
  @Column({
    type: "int",
  })
  fuelType!: FuelType;

  @Column({ nullable: false })
  userId!: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @BeforeInsert()
  beforeInsert() {
    this.id = uuidv7();
  }
}
