import { AbilityBuilder, PureAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Role, User } from "src/users/entities/user.entity";
import { Action } from "./action.enum";

type Subject =
  | 'User'
  | 'Patient'
  | 'Doctor'
  | 'Appointment'
  | 'all'
  | 'Contactquery';

export type AppAbility = PureAbility<[Action, Subject]>

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User): AppAbility {
      const {can, build} = new AbilityBuilder<AppAbility>(PureAbility);

        if (user.role === Role.ADMIN) {
            can(Action.Manage, 'all')
        } 
        else if( user.role === Role.DOCTOR){

            can(Action.Read, 'User');
            can(Action.Create, 'Appointment');
            can(Action.Update, 'Appointment');
            can(Action.Delete, ['Appointment', 'Doctor']);
            can(Action.Read, 'Patient'); 
            can(Action.Update, 'Patient');
        }else if (user.role === Role.PATIENT) {
            can(Action.Read, ['User', 'Doctor']);
            can(
              [Action.Create, Action.Update, Action.Read],
              ['Appointment', 'Contactquery'],
            );
            can([Action.Read, Action.Update], 'Patient');
        }
        return build();
    }
}