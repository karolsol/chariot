import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Exclude } from "class-transformer";
import { Allow } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ update: false })
  @Unique(["username"])
  username: string;

  @Column()
  @Exclude()
  @Allow()
  password: string;

  @Column()
  isAdmin: boolean;
}
