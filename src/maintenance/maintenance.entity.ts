import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vehicle } from "../vehicle/vehicle.entity";

@Entity()
export class Maintenance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  vehicleId: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  date: Date;

  @Column({ type: "float", nullable: false })
  cost: number;

  @Column({ nullable: true })
  invoiceLink: string;

  @Column({ nullable: false })
  mileage: number;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: "vehicleId" })
  Vehicle: Vehicle;
}
