import { Action } from "../action.enum";
import { AppAbility } from "../casl-ability.factory";


export class DoctorPolicies {
    static canReadDoctor(ability: AppAbility): boolean {
        return ability.can(Action.Read, 'Doctor');
    }
    static canUpdateDoctor(ability: AppAbility): boolean {
        return ability.can(Action.Update, 'Doctor');
    }
    static canDeleteDoctor(ability: AppAbility): boolean {
        return ability.can(Action.Delete, 'Doctor');
    }
}