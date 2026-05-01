import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { FuelType } from "@shared/fuel-type.enum";
import { Vehicle } from "../vehicle/vehicle.entity";
import { IsNumber } from "class-validator";

@Entity()
export class Refuel {
  @PrimaryColumn("uuid")
  id: string;
  @Column({ nullable: false })
  vehicleId: string;
  @Column({ nullable: false })
  date: Date;
  @Column({ type: "float", nullable: false })
  @IsNumber({ maxDecimalPlaces: 2 })
  fuelAmount: number;
  @Column({ type: "float", nullable: false })
  @IsNumber({ maxDecimalPlaces: 2 })
  fuelPrice: number;
  @Column({ nullable: false, type: "int" })
  fuelType: FuelType;
  @Column({ nullable: false })
  gasStation: string;
  @Column({ nullable: false })
  mileageAtRefuel: number;
  @Column({ nullable: true })
  invoiceLink: string;
  @ManyToOne(() => Vehicle, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "vehicleId" })
  Vehicle: Vehicle;
}
