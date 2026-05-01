import { BeforeInsert, Column, Entity, PrimaryColumn, Unique } from "typeorm";
import { v7 as uuidv7 } from "uuid";
import { Exclude } from "class-transformer";
import { Allow } from "class-validator";

@Entity()
export class User {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ update: false })
  @Unique(["username"])
  username: string;

  @Column()
  @Exclude()
  @Allow()
  password: string;

  @Column()
  isAdmin: boolean;

  @BeforeInsert()
  beforeInsert() {
    this.id = uuidv7();
  }
}
