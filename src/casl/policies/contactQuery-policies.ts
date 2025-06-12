import { Action } from '../action.enum';
import { AppAbility } from '../casl-ability.factory';

export class contactQueryPolicies {
  static canReadContactquery(ability: AppAbility): boolean {
    return ability.can(Action.Read, 'Contactquery');
  }
  static canUpdateContactquery(ability: AppAbility): boolean {
    return ability.can(Action.Update, 'Contactquery');
  }
  static canDeleteContactquery(ability: AppAbility): boolean {
    return ability.can(Action.Delete, 'Contactquery');
  }
}
