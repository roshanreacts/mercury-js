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
        fieldName: {
          type: 'string',
        },
        create: {
          type: 'boolean',
          required: true,
          default: false,
        },
        update: {
          type: 'boolean',
          required: true,
          default: false,
        },
        delete: {
          type: 'boolean',
          required: true,
          default: false,
        },
        read: {
          type: 'boolean',
          required: true,
          default: false,
        },
        modelField: {
          type: 'relationship',
          ref: 'ModelField',
          required: true,
        },
      },
      {
        historyTracking: false,
      }
    )
  }

  private subscribeHooks() {
    this.createFieldPermissionHook();
    this.updateFieldPermissionHook();
    // this.deleteFieldPermissionHook();
  }

  private createFieldPermissionHook() {
    const _self = this;
    this.mercury.hook.before("CREATE_FIELDPERMISSION_RECORD", async function (this: any) {
      if (this.options.skipHook) return;
      const permission = await _self.mercury.db.Permission.get({ profile: this.data.profile, model: this.data.model }, { id: '1', profile: 'Admin' });
      if (!permission.fieldLevelAccess) throw new Error("Field Level access is not enabled to this model for this profile");
      const record = await _self.mercury.db.FieldPermission.get(
        { model: this.data.model, profile: this.data.profile, modelField: this.data.modelField },
        { id: '1', profile: 'Admin' }
      );
      if (!_.isEmpty(record)) throw new Error("Field Level access is already defined for this profile");
      const modelField = await _self.mercury.db.ModelField.get({ _id: this.data.modelField }, { id: '1', profile: 'Admin' }, { select: "fieldName" });
      this.data.fieldName = modelField.fieldName;
      this.data.modelName = permission.modelName;
      this.data.profileName = permission.profileName;
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
      rules[index]['fields'][record.fieldName] = {};
      rules[index]['fields'][record.fieldName] = _self.utility.composeFieldPermissions([record])[record.fieldName];
      _self.mercury.access.updateProfile(record.profileName, rules);
      await _self.mercury.cache.set(record.profileName, JSON.stringify(rules));
    });
  }

  private updateFieldPermissionHook() {
    const _self = this;
    this.mercury.hook.after("UPDATE_FIELDPERMISSION_RECORD", async function (this: any) {
      const record = await _self.mercury.db.FieldPermission.get(
        { _id: this.record._id },
        { id: '1', profile: 'Admin' }
      );
      const rules = JSON.parse(await _self.mercury.cache.get(this.prevRecord.profileName) as string);
      const index = rules.findIndex((r: any) => r.modelName === this.prevRecord.modelName);
      let fieldPermissions = _self.utility.composeFieldPermissions([record])[record.fieldName];
      if (_.isEqual(rules[index]['access'], fieldPermissions)) {
        delete rules[index]['fields'][record.fieldName];
        await _self.mercury.db.FieldPermission.delete(record._id, { id: '1', profile: 'Admin' }, { skipHook: true });
      } else {
        rules[index]['fields'][record.fieldName] = fieldPermissions;
      }
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
      delete rules[index]['fields'][this.deletedRecord.fieldName];
      _self.mercury.access.updateProfile(this.deletedRecord.profileName, rules);
      await _self.mercury.cache.set(this.deletedRecord.profileName, JSON.stringify(rules));
    })
  }
}