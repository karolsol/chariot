import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Vehicle } from "../vehicle/vehicle.entity";
import { User } from "../user/user.entity";
import { v7 as uuidv7 } from "uuid";
import type { IMaintenance } from "@chariot/shared";

@Entity()
export class Maintenance implements IMaintenance {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  vehicleId!: string;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: false })
  date!: Date;

  @Column({ type: "float", nullable: false })
  cost!: number;

  @Column({ nullable: true })
  invoiceLink!: string;

  @Column({ nullable: false })
  mileage!: number;

  @ManyToOne(() => Vehicle, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "vehicleId" })
  vehicle!: Vehicle;

  @Column({ nullable: false })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @BeforeInsert()
  beforeInsert() {
    this.id = uuidv7();
  }
}
