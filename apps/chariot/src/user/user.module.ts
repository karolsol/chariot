import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CaslModule } from "../casl/casl.module";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), CaslModule, CommonModule],
  exports: [UserService, TypeOrmModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
