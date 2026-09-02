import { Injectable } from "@nestjs/common";
import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from "@casl/ability";
import { Action } from "./casl-action.enum";
import { User } from "../user/user.entity";
import { Vehicle } from "../vehicle/vehicle.entity";
import { Maintenance } from "../maintenance/maintenance.entity";

type Subjects =
  InferSubjects<typeof User | typeof Vehicle | typeof Maintenance> | "all";

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    cannot(Action.Manage, "all");

    if (user.isAdmin) {
      can(Action.Manage, "all");
    }

    can(Action.Create, User);
    can(Action.Manage, User, { id: user.id });

    can(Action.Manage, "all", { userId: user.id });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    }) as AppAbility;
  }
}
