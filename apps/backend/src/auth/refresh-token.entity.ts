import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { User } from "../user/user.entity";
import { v7 as uuidv7 } from "uuid";

@Entity()
export class RefreshToken {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ nullable: false })
  userId!: string;

  @Column({ nullable: false, unique: true })
  token!: string;

  @Column({ nullable: false })
  expiresAt!: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @BeforeInsert()
  beforeInsert() {
    this.id = uuidv7();
  }
}
