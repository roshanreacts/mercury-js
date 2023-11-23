import { mapKeys } from 'lodash';
import mercury from './mercury';
export class Access {
  profiles: Profile[] = [];
  // constructor() {
  //   // this.profiles.push({
  //   //   name: ' SUPERADMIN',
  //   //   rules: [
  //   //     {
  //   //       modelName: 'User',
  //   //       access: {
  //   //         read: true,
  //   //         create: true,
  //   //         update: true,
  //   //         delete: true,
  //   //       },
  //   //       fieldLevelAccess: false,
  //   //       fields: {},
  //   //     },
  //   //   ],
  //   // });
  // }
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
      // if (!rule) {
      //   throw new Error(`Model ${modelName} does not exist.`);
      // }
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
    modelName: string,
    select: PopulateSchema,
    action: TAction,
    user: CtxUser
  ) {
    const profile = this.profiles.find(
      (profile) => profile.name === user.profile
    );
    if (profile) {
      // retrive the model
      const model = mercury.list.find((model) => model.name === modelName);
      if (!model) {
        throw new Error(`Model ${modelName} does not exist.`);
      }

      const allAccess: boolean[] = select.map((val) => {
        const childPopulate: boolean = val.populate
          ? this.validateDeepAccess(
              model.fields[val.path]?.ref || '',
              val.populate,
              action,
              user
            )
          : true;
        return (
          childPopulate &&
          this.validateAccess(
            model.fields[val.path]?.ref || '',
            action,
            user,
            val.select
          ) // check ref on model or throw error
        );
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
