import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ update: false })
  @Unique(["username"])
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  isAdmin: boolean;
}
