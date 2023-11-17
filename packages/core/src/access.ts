import { keyBy, mapKeys } from 'lodash';

class Access {
  profiles: Profile[] = [];
  constructor() {}
  validateAccess<T>(
    modelName: string,
    action: TAction,
    user: CtxUser,
    fields: string[]
  ) {
    const profile = this.profiles.find(
      (profile) => profile.name === user.profile
    );
    if (profile) {
      const rule = profile.rules.find((rule) => rule.modelName === modelName);
      if (action != 'delete' && rule?.fieldLevelAccess) {
        // check for all the fields in the fields array
        const allFields: boolean[] = [];
        mapKeys(rule.fields, (value, key) =>
          fields.includes(key) ? allFields.push(value[action]) : null
        );
        return allFields.every((field) => field);
      }
      if (rule) {
        return rule.access[action];
      }
    }
    return false;
  }
  validateDeepAccess<T>(
    select: Array<{ model: string; select: string[] }>,
    action: TAction,
    user: CtxUser
  ) {
    const profile = this.profiles.find(
      (profile) => profile.name === user.profile
    );
    if (profile) {
      const allAccess = select.map((val) => {
        return this.validateAccess(val.model, action, user, val.select);
      });
      return allAccess.every((field) => field);
    }
    return false;
  }
  createProfile(name: string, rules: Rule[]) {
    const profile = this.profiles.find((profile) => profile.name === name);
    if (profile) {
      throw new Error(`Profile ${name} already exist.`);
    }
    this.profiles.push({ name, rules });
  }

  extendProfile(name: string, rules: Rule[]) {
    const profile = this.profiles.find((profile) => profile.name === name);
    if (!profile) {
      throw new Error(`Profile ${name} does not exist.`);
    }
    profile.rules = profile.rules.concat(rules);
  }
}

const access: Access = new Access();
export default access;
