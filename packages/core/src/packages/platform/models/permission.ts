import type { Mercury } from '../../../mercury';
import { AfterHook, Utility } from '../utility';
import _ from 'lodash';
import { Rule } from '../../../../types';

export class Permission {
  protected mercury: Mercury;
  protected utility;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
    this.utility = new Utility(this.mercury);
    this.createPermission();
    this.subscribeHooks();
  }
  private createPermission() {
    this.mercury.createModel(
      'Permission',
      {
        profile: {
          type: 'relationship',
          ref: 'Profile',
          required: true,
        },
        profileName: {
          type: 'string',
        },
        model: {
          type: 'relationship',
          ref: 'Model',
          required: true,
        },
        modelName: {
          type: 'string',
        },
        create: {
          type: 'boolean',
          required: true,
        },
        update: {
          type: 'boolean',
          required: true,
        },
        delete: {
          type: 'boolean',
          required: true,
        },
        read: {
          type: 'boolean',
          required: true,
        },
        fieldLevelAccess: {
          type: 'boolean',
          required: true,
          default: false,
        },
      },
      {
        historyTracking: false,
      }
    );
  }

  private subscribeHooks() {
    this.createPermissionHook();
    this.updatePermissionHook();
    this.deletePermissionHook();
  }

  // permissions are not deleted for the profile delete
  private createPermissionHook() {
    const _self = this;
    this.mercury.hook.before(
      'CREATE_PERMISSION_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        const record = await _self.mercury.db.Permission.get(
          { model: this.data.model, profile: this.data.profile },
          { id: '1', profile: 'SystemAdmin' }
        );
        if (!_.isEmpty(record))
          throw new Error(
            'Permissions are already defined to this model for this profile'
          );
        const profile = await _self.mercury.db.Profile.get(
          { _id: this.data.profile },
          { id: '1', profile: 'SystemAdmin' },
          { select: 'name' }
        );
        const model = await _self.mercury.db.Model.get(
          { _id: this.data.model },
          { id: '1', profile: 'SystemAdmin' },
          { select: 'name' }
        );
        this.data.profileName = profile.name;
        this.data.modelName = model.name;
      }
    );
    this.mercury.hook.after(
      'CREATE_PERMISSION_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        const record = await _self.mercury.db.Permission.get(
          { _id: this.record._id },
          { id: '1', profile: 'SystemAdmin' }
        );
        const rules = JSON.parse(
          (await _self.mercury.cache.get(record.profileName)) as string
        );
        const access = _self.utility.composeModelPermission(record);
        rules.push({
          modelName: record.modelName,
          access: access,
          fieldLevelAccess: record.fieldLevelAccess,
        });
        await _self.mercury.cache.set(
          record.profileName,
          JSON.stringify(rules)
        );
        _self.mercury.access.updateProfile(record.profileName, rules);
      }
    );
  }

  private updatePermissionHook() {
    const _self = this;
    this.mercury.hook.before(
      'UPDATE_PERMISSION_RECORD',
      async function (this: any) {}
    );
    this.mercury.hook.after(
      'UPDATE_PERMISSION_RECORD',
      async function (this: any) {
        const record = await _self.mercury.db.Permission.get(
          { _id: this.record._id },
          { id: '1', profile: 'SystemAdmin' }
        );
        const rules = JSON.parse(
          (await _self.mercury.cache.get(record.profileName)) as string
        );
        const index = rules.findIndex(
          (r: any) => r.modelName === record.modelName
        );
        rules[index]['access'] = _self.utility.composeModelPermission(record);
        rules[index]['fieldLevelAccess'] = record.fieldLevelAccess;
        await _self.mercury.cache.set(
          record.profileName,
          JSON.stringify(rules)
        );
        _self.mercury.access.updateProfile(record.profileName, rules);
      }
    );
  }

  private deletePermissionHook() {
    const _self = this;
    this.mercury.hook.before(
      'DELETE_PERMISSION_RECORD',
      async function (this: any) {}
    );
    this.mercury.hook.after(
      'DELETE_PERMISSION_RECORD',
      async function (this: any) {
        let rules: Rule[] = JSON.parse(
          (await _self.mercury.cache.get(
            this.deletedRecord.profileName
          )) as string
        );
        rules = rules.filter(
          (r: any) => r.modelName !== this.deletedRecord.modelName
        );
        await _self.deleteFieldPermissions(
          this.deletedRecord.profile,
          this.deletedRecord.model
        );
        await _self.mercury.cache.set(
          this.deletedRecord.profileName,
          JSON.stringify(rules)
        );
        _self.mercury.access.updateProfile(
          this.deletedRecord.profileName,
          rules
        );
      }
    );
  }

  private async deleteFieldPermissions(profile: any, model: any) {
    await this.mercury.db['FieldPermission'].mongoModel.deleteMany({
      profile: profile,
      model: model,
    });
  }
}
