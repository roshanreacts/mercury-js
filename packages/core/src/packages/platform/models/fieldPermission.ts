import type { Mercury } from '../../../mercury';
import { AfterHook, Utility } from "../utility";
import _ from "lodash";

export class FieldPermission {
  protected mercury: Mercury;
  protected utility;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
    this.utility = new Utility(this.mercury);
    this.createFieldPermission();
    this.subscribeHooks();
  }
  private createFieldPermission() {
    this.mercury.createModel(
      "FieldPermission",
      {
        profile: {
          type: 'relationship',
          ref: 'Profile',
        },
        profileName: {
          type: 'string',
        },
        model: {
          type: 'relationship',
          ref: 'Model',
        },
        modelName: {
          type: 'string',
        },
        fieldName: {
          type: 'string',
          required: true,
        },
        modelField: {
          type: 'relationship',
          ref: 'ModelField',
        },
        action: {
          type: 'enum',
          enum: ['create', 'read', 'update', 'delete'],
          enumType: 'string',
          required: true,
        }
      },
      {
        historyTracking: false,
      }
    )
  }

  private subscribeHooks() {
    this.createFieldPermissionHook();
    this.updateFieldPermissionHook();
    this.deleteFieldPermissionHook();
  }

  private createFieldPermissionHook() {
    const _self = this;
    this.mercury.hook.before("CREATE_FIELDPERMISSION_RECORD", async function (this: any) {
      if (this.options.skipHook) return;
      const permission = await _self.mercury.db.Permission.get({ profile: this.data.profile, model: this.data.model }, { id: '1', profile: 'Admin' });
      if (!permission.fieldLevelAccess) throw new Error("Field Level access is not enabled to this model for this particular profile");
      const record = await _self.mercury.db.FieldPermission.get(
        { model: this.data.model, profile: this.data.profile, modelField: this.data.modelField, action: this.data.action },
        { id: '1', profile: 'Admin' }
      );
      if (!_.isEmpty(record)) throw new Error("Field Level access is already defined for this profile");
    })
    this.mercury.hook.after("CREATE_FIELDPERMISSION_RECORD", async function (this: any) {
      if (this.options.skipHook) return;
      const record = await _self.mercury.db.FieldPermission.get(
        { _id: this.record._id },
        { id: '1', profile: 'Admin' }
      );
      const rules = JSON.parse(await _self.mercury.cache.get(record.profileName) as string);
      const index = rules.findIndex((m: any) => m.modelName === record.modelName);
      if (_.isEmpty(rules[index]['fields'])) rules[index]['fields'] = {};
      if (_.isEmpty(rules[index]['fields'][record.fieldName])) rules[index]['fields'][record.fieldName] = {};
      rules[index]['fields'][record.fieldName][record.action] = false;
      _self.mercury.access.updateProfile(record.profileName, rules);
      await _self.mercury.cache.set(record.profileName, JSON.stringify(rules));
    });
  }

  private updateFieldPermissionHook() {
    const _self = this;
    this.mercury.hook.before("UPDATE_FIELDPERMISSION_RECORD", async function (this: any) {

    })
    this.mercury.hook.after("UPDATE_FIELDPERMISSION_RECORD", async function (this: any) {
      const record = await _self.mercury.db.FieldPermission.get(
        { _id: this.record._id },
        { id: '1', profile: 'Admin' }
      );
      const rules = JSON.parse(await _self.mercury.cache.get(this.prevRecord.profileName) as string);
      const index = rules.findIndex((r: any) => r.modelName === this.prevRecord.modelName);
      delete rules[index]['fields'][this.prevRecord.fieldName][this.prevRecord.action];
      if (_.isEmpty(rules[index]['fields'][record.fieldName])) rules[index]['fields'][record.fieldName] = {};
      rules[index]['fields'][record.fieldName][record.action] = false;
      _self.mercury.access.updateProfile(record.profileName, rules);
      await _self.mercury.cache.set(record.profileName, JSON.stringify(rules));
    })
  }

  private deleteFieldPermissionHook() {
    const _self = this;
    this.mercury.hook.before("DELETE_FIELDPERMISSION_RECORD", async function (this: any) {

    })
    this.mercury.hook.after("DELETE_FIELDPERMISSION_RECORD", async function (this: any) {
      const rules = JSON.parse(await _self.mercury.cache.get(this.deletedRecord.profileName) as string);
      const index = rules.findIndex((r: any) => r.modelName === this.deletedRecord.modelName);
      delete rules[index]['fields'][this.deletedRecord.fieldName][this.deletedRecord.action];
      _self.mercury.access.updateProfile(this.deletedRecord.profileName, rules);
      await _self.mercury.cache.set(this.deletedRecord.profileName, JSON.stringify(rules));
    })
  }
}