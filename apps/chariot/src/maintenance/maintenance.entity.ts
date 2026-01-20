import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vehicle } from "../vehicle/vehicle.entity";
import { User } from "../user/user.entity";

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

  @ManyToOne(() => Vehicle, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "vehicleId" })
  Vehicle: Vehicle;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  User: User;
}
