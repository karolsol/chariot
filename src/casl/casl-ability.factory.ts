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

type Subjects = InferSubjects<typeof User> | "all";

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

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
