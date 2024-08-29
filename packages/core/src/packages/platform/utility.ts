import { Platform } from '.';
import _ from 'lodash';
import mercury from '../../mercury';
import type { Mercury } from '../../mercury';
import {
  TField,
  TFieldOption,
  TModelField,
  TModelOption,
  TMetaModel,
} from '../../../types';

export class Utility {
  protected mercury: Mercury;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
  }

  // give type to profile
  public composeModelPermission(permission: any) {
    const access: any = {};
    ['create', 'update', 'delete', 'read'].map((action: string) => {
      access[action] = permission[action];
    });
    return access;
  }

  public composeFieldPermissions(fieldPermissions: any) {
    const fields: any = {};
    fieldPermissions.map((fieldPermission: any) => {
      if (_.isEmpty(fields[fieldPermission.fieldName]))
        fields[fieldPermission.fieldName] = {};
      ['create', 'update', 'delete', 'read'].map((action: string) => {
        fields[fieldPermission.fieldName][action] = fieldPermission[action];
      });
    });
    return fields;
  }
  public composeSchema(
    modelFields: TModelField[],
    fieldOptions?: TFieldOption[]
  ) {
    const skipFields = [
      'id',
      '_id',
      'type',
      'fieldName',
      'model',
      'name',
      'modelName',
      'label',
      'createdBy',
      'updatedBy',
      'managed',
      'fieldOptions',
      'createdOn',
      'updatedOn',
      '__v',
    ];
    let schema: any = {};
    modelFields.map((modelField: any) => {
      const fieldName = modelField['fieldName'];
      const fieldObj: TField = { type: modelField['type'] };
      Object.keys(modelField['_doc']).map((key: string) => {
        // Return for some fields
        if (skipFields.includes(key)) return;
        if (key != 'enumValues') fieldObj[key] = modelField[key];
        if (key == 'enumValues' && modelField[key].length) {
          fieldObj['enum'] = modelField[key];
        }
      });
      if (fieldOptions) {
        const fieldOption = fieldOptions.filter((fieldOption: any) =>
          fieldOption.modelField.equals(modelField._id)
        );
        fieldOption.map((option: TFieldOption) => {
          let type = option.type;
          let value = option.value;
          fieldObj[option.keyName] =
            type == 'number'
              ? Number(value)
              : type == 'string'
              ? String(value)
              : type == 'boolean'
              ? value === 'true'
              : Boolean(value);
        });
      }
      schema[fieldName] = fieldObj;
    });
    return schema;
  }

  public composeOptions(modelOptions: TModelOption[]) {
    let options: any = {};
    modelOptions.map((modelOption: TModelOption) => {
      let type = modelOption.type;
      let value = modelOption.value;
      options[modelOption.keyName] =
        type == 'number'
          ? Number(value)
          : type == 'string'
          ? String(value)
          : type == 'boolean'
          ? value === 'true'
          : Boolean(value);
    });
    return options;
  }

  public async createDefaultModelOptions(model: TMetaModel) {
    ['historyTracking', 'private'].map((option: string) => {
      this.createMetaRecords('ModelOption', {
        model: model._id,
        modelName: model.name,
        managed: false,
        keyName: option,
        value: false,
        type: 'boolean',
      });
    });
  }

  public async createMetaRecords(modelName: string, data: any) {
    return await this.mercury.db[modelName].create(
      data,
      {
        id: '1',
        profile: 'SystemAdmin',
      },
      { skipHook: true }
    );
  }

  // public async createAdminPermissions(admin: any) {
  //   console.log("List of models", this.mercury.list)
  //   await Promise.all([this.mercury.list.map(async (model: TModel) => {
  //     // meta models skip - approach 1
  //     const modelRecord = await this.mercury.db.Model.mongoModel.findOne({ name: model.name });
  //     if (!_.isEmpty(modelRecord)) {
  //       const permission = {
  //         profile: admin._id,
  //         profileName: 'Admin',
  //         model: modelRecord._id,
  //         modelName: model.name,
  //         create: true,
  //         update: true,
  //         delete: true,
  //         read: true
  //       }
  //       await this.mercury.db.Permission.mongoModel.update(permission, permission, { upsert: true, new: true });
  //     }
  //   })])
  // }

  public titleCase(str: string) {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

export function AfterHook(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (this: Platform, ...args: any[]) {
    try {
      // before hook
      // after hook
      const result = originalMethod.apply(this, args);
      if (result instanceof Promise) {
        return result.then(async (res: any) => {
          await new Promise((resolve, reject) => {
            this.mercury.hook.execAfter(
              `PLATFORM_INITIALIZE`,
              {},
              [],
              function (error: any) {
                if (error) {
                  // Reject the Promise if there is an error
                  reject(error);
                } else {
                  // Resolve the Promise if there is no error
                  resolve(true);
                }
              }
            );
          });
          return res;
        });
      } else {
        return result;
      }
    } catch (error: any) {
      console.log('Platform Error: ', error);
    }
  };

  return descriptor;
}
