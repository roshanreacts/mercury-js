import type { Mercury } from '../../mercury';
// import { Redis } from '../redisCache';
import _ from 'lodash';
import { Model, ModelOption, FieldOption, ModelField, Tab, Component, Layout, Profile, Permission, FieldPermission, LayoutStructure, User } from './models';
import { Utility } from './utility';
import { SystemAdminRules } from './rules';

type PlatformConfig = {
  prefix?: string;
};

declare module '../../mercury' {
  interface Mercury {
    platform: Platform;
  }
}

export default (config?: PlatformConfig) => {
  return (mercury: Mercury) => {
    mercury.platform = new Platform(mercury, config);
    mercury.platform.initialize();
    // mercury.platform.start();
  };
};
export class Platform {
  protected mercury: Mercury;
  public config: PlatformConfig;
  public skipFields: string[];
  public ctx: any;
  protected utility;
  constructor(mercury: Mercury, config?: PlatformConfig) {
    this.mercury = mercury;
    this.utility = new Utility(this.mercury);
    this.ctx = { id: "1", profile: "SystemAdmin" };
    this.config = config || {};
    this.skipFields = [
      'type',
      'ref',
      'enumType',
      'enumValues',
      'required',
      'unique',
      'many',
      'localField',
      'foreignField',
      'bcrypt',
      'rounds',
      'relationship',
      'managed',
      'default',
    ];
  }
  public async start() {
    // Get all the models from Model table and generate model schema and pass it to mercury.createModel
    // Store all the model schemas as Redis Cache with search capability (Make sure redis is enabled)
    // await this.subscribeHooks();
    await this.subscribeToModelHooks();
  }

  public createModelApi(name: string, fields: TFields, options?: TOptions) {
    this.mercury.createModel(name, fields, options);
  }

  public async initialize() {
    // Create SystemSystemAdmin profile
    // createMetaModels(this.mercury);
    new Model(this.mercury);
    new ModelField(this.mercury);
    new ModelOption(this.mercury);
    new FieldOption(this.mercury);
    new Tab(this.mercury);
    new Component(this.mercury);
    new Layout(this.mercury);
    new LayoutStructure(this.mercury);
    new Profile(this.mercury);
    new Permission(this.mercury);
    new FieldPermission(this.mercury);
    new User(this.mercury);
    await this.composeSystemAdminProfile();
    await this.composeAllProfilesPermissions();
    await this.composeAllRedisSchemas();
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
  }

  private async composeSystemAdminProfile() {
    let systemAdminProfile = await this.mercury.db.Profile.mongoModel.findOne({ name: 'SystemAdmin' }).populate('permissions');
    if (_.isEmpty(systemAdminProfile)) {
      systemAdminProfile = await this.mercury.db.Profile.mongoModel.create({
        name: 'SystemAdmin',
        label: 'SystemAdmin'
      });
    }
    await this.composeProfilePermission(systemAdminProfile, systemAdminProfile.permissions ?? [])
    const systemAdminRules = JSON.parse(await this.mercury.cache.get('SystemAdmin') as string);
    systemAdminRules.push(...SystemAdminRules);
    this.mercury.access.updateProfile('SystemAdmin', systemAdminRules);
    this.mercury.cache.set('SystemAdmin', JSON.stringify(systemAdminRules));
  }

  public async composeAllProfilesPermissions() {
    const allProfiles = await this.mercury.db.Profile.list({}, { id: '1', profile: 'SystemAdmin' }, { populate: [{ path: 'permissions' }] });
    await Promise.all(allProfiles.map(async (profile: any) => {
      if (profile.name != 'SystemAdmin') 
      await this.composeProfilePermission(profile, profile.permissions);
    }))
  }

  public async composeProfilePermission(profile: any, permissions: any = []) {
    const rules: Rule[] = [];
    await Promise.all(permissions.map(async (permission: any) => {
      const rule: Rule = {
        modelName: permission.modelName,
        access: this.utility.composeModelPermission(permission)
      }
      if (permission.fieldLevelAccess) {
        const fieldPermissions = await this.mercury.db.FieldPermission.list({ profile: profile._id, model: permission.model }, { id: '1', profile: 'SystemAdmin' }, {});
        rule['fieldLevelAccess'] = permission.fieldLevelAccess;
        rule['fields'] = this.utility.composeFieldPermissions(fieldPermissions);
      }
      rules.push(rule);
    }));
    await this.mercury.cache.set(profile.name, JSON.stringify(rules));
    this.mercury.access.createProfile(profile.name, rules);
  }


  public async composeAllRedisSchemas() {
    // Write one single mongo query to get all the data ( reduce number of memory reads )
    const models: TMetaModel[] = await this.mercury.db['Model'].list({}, { id: '1', profile: 'SystemAdmin' }, {});
    const allModels: string[] = [];
    await Promise.all(models.map(async (model: TMetaModel) => {
      allModels.push(model.name);
      await this.composeRedisObject(model);
    }));
    await this.mercury.cache.set('ALL_MODELS', JSON.stringify(allModels));
  }

  public async composeRedisObject(model: TMetaModel) {
    let modelFields, modelOptions, fieldOptions = [];
    try {
      modelFields = await this.mercury.db['ModelField'].list(
        { model: model._id, modelName: model.name },
        { id: '1', profile: 'SystemAdmin' },
        {}
      );
    } catch (err) {
      modelFields = [];
    }
    try {
      fieldOptions = await this.mercury.db['FieldOption'].list(
        { model: model._id },
        { id: '1', profile: 'SystemAdmin' },
        {}
      );
    } catch (err) {
      fieldOptions = [];
    }
    try {
      modelOptions = await this.mercury.db['ModelOption'].list(
        { model: model._id },
        { id: '1', profile: 'SystemAdmin' },
        {}
      );
    } catch (err) {
      modelOptions = [];
    }
    const schema = this.utility.composeSchema(modelFields, fieldOptions);
    const options = this.utility.composeOptions(modelOptions);
    const redisObj = {
      name: model.name,
      fields: schema,
      options: options,
    };
    await this.mercury.cache.set(
      `${model.name.toUpperCase()}`,
      JSON.stringify(redisObj)
    );
    if(!_.isEmpty(schema))
    this.mercury.createModel(model.name, schema, options);
  }
  // public composeSchema(
  //   modelFields: TModelField[],
  //   fieldOptions?: TFieldOption[]
  // ) {
  //   const skipFields = [
  //     'id',
  //     '_id',
  //     'type',
  //     'fieldName',
  //     'model',
  //     'name',
  //     'createdBy',
  //     'updatedBy',
  //     'managed',
  //     'fieldOptions',
  //     'createdOn',
  //     'updatedOn',
  //     '__v',
  //   ];
  //   let schema: any = {};
  //   modelFields.map((modelField: any) => {
  //     const fieldName = modelField['fieldName'];
  //     const fieldObj: TField = { type: modelField['type'] };
  //     Object.keys(modelField['_doc']).map((key: string) => {
  //       // Return for some fields
  //       if (skipFields.includes(key)) return;
  //       if (
  //         key != 'enumValues' ||
  //         (key == 'enumValues' && modelField[key].length)
  //       )
  //         fieldObj[key] = modelField[key];
  //     });
  //     if (fieldOptions) {
  //       const fieldOption = fieldOptions.filter((fieldOption: any) =>
  //         fieldOption.modelField.equals(modelField._id)
  //       );
  //       fieldOption.map((option: TFieldOption) => {
  //         let type = option.type;
  //         let value = option.value;
  //         fieldObj[option.keyName] =
  //           type == 'number'
  //             ? Number(value)
  //             : type == 'string'
  //               ? String(value)
  //               : value === 'true';
  //       });
  //     }
  //     schema[fieldName] = fieldObj;
  //   });
  //   return schema;
  // }

  // public composeOptions(modelOptions: TModelOption[]) {
  //   let options: any = {};
  //   console.log('modelOptions', modelOptions);
  //   modelOptions.map((modelOption: TModelOption) => {
  //     let type = modelOption.type;
  //     let value = modelOption.value;
  //     options[modelOption.keyName] =
  //       type == 'number'
  //         ? Number(value)
  //         : type == 'string'
  //           ? String(value)
  //           : type == 'boolean'
  //             ? value === 'true'
  //             : value;
  //   });
  //   return options;
  // }

  public async listModels() {
    let allModels: string | null = await this.mercury.cache.get('ALL_MODELS');
    return allModels == null ? [] : JSON.parse(allModels);
  }

  public async getModel(modelName: string) {
    let model: string | TModel | null = await this.mercury.cache.get(modelName);
    return model == null ? {} : JSON.parse(model);
  }

  // private async subscribeHooks() {
  //   // Model create and update hooks has to be triggered
  //   // Record update also has to be triggered -> here we will update in the db and redis.
  //   await this.subscribeToModelHooks();
  //   // this.subscribeToRecordHooks();
  // }

  private async subscribeToModelHooks() {
    // Before the server starts and restart in middle
    // if already present in redis and schema is equal -> return
    // if redis absent try to fetch from db if present or not , if present pull it from there instead of creating
    // present in redis and schema not equal , build new schema adn store it
    const _self = this;
    this.mercury.hook.before('CREATE_MODEL', async function (this: TModel) {
      if (
        ['Model', 'ModelField', 'FieldOption', 'ModelOption'].includes(
          this.name
        )
      )
        return;
      let redisObj: any = await _self.mercury.cache.get(
        this.name.toUpperCase()
      );
      if (redisObj != null) redisObj = JSON.parse(redisObj);
      if (!_.isEmpty(redisObj)) {
        if (_self.isSchemaSame(this, redisObj)) return;
        console.log('Schema is different');
        console.log('Redis Objs', redisObj, this);
        await _self.mercury.cache.set(
          this.name.toUpperCase(),
          JSON.stringify(this)
        );
        if (!_.isEqual(redisObj.fields, this.fields)) {
          await _self.modifyModelFields(this, redisObj);
        } else if (!_.isEqual(redisObj.options, this.options)) {
          await _self.modifyModelOptions(redisObj, this);
        } else {
          await _self.modifyModelFields(this, redisObj);
          await _self.modifyModelOptions(redisObj, this);
        }
      } else {
        // first set inside redis
        await _self.mercury.cache.set(
          this.name.toUpperCase(),
          JSON.stringify(this)
        );
        // await _self.createRecords(this);
      }
    });
  }

  private isSchemaSame(model: TModel, redisObj: TModel) {
    return (
      _.isEqual(redisObj.fields, model.fields) &&
      _.isEqual(redisObj.options, model.options)
    );
  }

  private async createModelFields(
    model: TMetaModel,
    remFields: any,
    fieldName: string
  ) {
    return await this.utility.createMetaRecords('ModelField', {
      model: model._id,
      modelName: model.name,
      fieldName: fieldName,
      ...remFields,
    });
  }

  private async createFieldOptions(modelField: any, fieldOptions: any) {
    Object.entries(fieldOptions).forEach(async ([fkey, fvalue]: any) => {
      await this.utility.createMetaRecords('FieldOption', {
        model: modelField.model,
        modelField: modelField._id,
        fieldName: modelField.fieldName,
        keyName: fkey,
        value: fvalue,
      });
    });
  }

  private async updateModelFields(
    modelField: any,
    fieldOptions: any,
    redisObj: any,
    modelObj: any
  ) {
    let updateData: any = {};
    Object.entries(fieldOptions).forEach(async ([vkey, vvalue]: any) => {
      if (this.skipFields.includes(vkey) && modelField[vkey] == vvalue) return;
      if (this.skipFields.includes(vkey) && modelField[vkey] !== vvalue) {
        updateData[vkey] = vvalue;
      } else {
        // field option create or update
        await this.createOrUpdateFieldOptions(modelField, vkey, vvalue);
      }
    });
    await this.deleteFieldOptions(
      redisObj,
      modelObj,
      modelField.fieldName,
      modelField
    );
    if (!_.isEmpty(updateData))
      await this.mercury.db['ModelField'].update(
        modelField._id,
        { ...updateData },
        { id: 'qwe', profile: 'SystemAdmin' },
        { skipHook: true }
      );
  }

  private async deleteModelFields(
    redisObj: any,
    modelObj: any,
    modelData: any
  ) {
    // delete field and field options associated to it
    const deleteFields = Object.keys(
      _.omit(redisObj.fields, Object.keys(modelObj.fields))
    );
    console.log('🚀 ~ Platform ~ deleteFields:', deleteFields);
    deleteFields.map(async (deleteField: string) => {
      console.log(
        '🚀 ~ Platform ~ deleteFields.map ~ deleteField:',
        deleteField
      );
      const modelField = await this.mercury.db['ModelField'].get(
        { model: modelData._id, modelName: modelData.name, fieldName: deleteField },
        { id: 'sdf', profile: 'SystemAdmin' }
      );
      await this.mercury.db['FieldOption'].mongoModel.deleteMany({
        model: modelData._id,
        modelField: modelField._id,
      });
      await this.mercury.db['ModelField'].mongoModel.deleteOne({
        _id: modelField._id,
      });
    });
  }

  private async createOrUpdateFieldOptions(
    modelField: any,
    keyName: string,
    value: any
  ) {
    const fieldOption = await this.mercury.db['FieldOption'].get(
      {
        modelField: modelField._id,
        fieldName: modelField.fieldName,
        keyName: keyName,
      },
      { id: 'qe34', profile: 'SystemAdmin' }
    );
    if (_.isEmpty(fieldOption)) {
      await this.utility.createMetaRecords('FieldOption', {
        model: modelField.model,
        modelField: modelField._id,
        fieldName: modelField.fieldName,
        keyName: keyName,
        value: value,
      });
    } else {
      if (fieldOption.value == value) return;
      await this.mercury.db['FieldOption'].update(
        fieldOption._id,
        { value: value },
        { id: '123', profile: 'SystemAdmin' },
        { skipHook: true }
      );
    }
  }

  private async deleteFieldOptions(
    redisObj: any,
    modelObj: any,
    key: string,
    modelField: any
  ) {
    const updateData: any = {};
    console.log('🚀 ~ Platform ~ modelObj.fields[key]:', modelObj.fields[key]);
    console.log('🚀 ~ Platform ~ redisObj.fields[key]:', redisObj.fields[key]);
    const deleteFieldOptions = Object.keys(
      _.omit(redisObj.fields[key], Object.keys(modelObj.fields[key]))
    );
    console.log('🚀 ~ Platform ~ deleteFieldOptions:', deleteFieldOptions);
    deleteFieldOptions.map(async (fieldOption: string) => {
      updateData[fieldOption] = undefined; // setting value undefined in model field data and deleting field option
      if (!this.skipFields.includes(fieldOption)) {
        console.log('DELETE FIELD OPTION');
        await this.mercury.db['FieldOption'].mongoModel.deleteOne({
          model: modelField.model,
          modelField: modelField._id,
          fieldName: key,
          keyName: fieldOption,
        });
        console.log('DONE DELETE FIELD OPTION');
      }
    });
    console.log('🚀 ~ Platform ~ updateData:', updateData);
    return;
  }

  private async modifyModelFields(modelObj: any, redisObj: any) {
    const modelData = await this.mercury.db['Model'].get(
      { name: modelObj.name },
      { id: 'af', profile: 'SystemAdmin' }
    );
    const diffFieldObj = this.getDiffFieldObj(redisObj, modelObj);
    Object.entries(diffFieldObj).forEach(async ([key, value]: any) => {
      const modelField: TModelField = await this.mercury.db['ModelField'].get(
        { model: modelData._id, fieldName: key },
        { id: 'saf', profile: 'SystemAdmin' }
      );
      if (_.isEmpty(modelField)) {
        const newModelField = await this.createModelFields(
          modelData,
          value,
          key
        ); // create new model fields
        this.createFieldOptions(newModelField, _.omit(value, this.skipFields)); // create field options
      } else {
        this.updateModelFields(modelField, value, redisObj, modelObj);
      }
    });
    // here delete functionality
    this.deleteModelFields(redisObj, modelObj, modelData);
  }

  private getDiffFieldObj(redisObj: any, model: any) {
    return _.omitBy(model.fields, (value, key) => {
      return _.isEqual(value, redisObj.fields[key]);
    });
  }

  // public async createMetaRecords(modelName: string, data: any) {
  //   return await this.mercury.db[modelName].create(
  //     data,
  //     {
  //       id: 'q2',
  //       profile: 'SystemAdmin',
  //     },
  //     { skipHook: true }
  //   );
  // }

  private async createRecords(modelObj: any) {
    console.log('INSIDE_CREATE_RECORD');
    // create model, model fields and etc
    const model = await this.utility.createMetaRecords('Model', {
      name: modelObj.name,
      prefix: modelObj.prefix,
      managed: modelObj.managed,
      createdBy: modelObj?.ctx?.id,
      updatedBy: modelObj?.ctx?.id,
    });
    console.log('Model record', model);
    // this is not working
    // model fields and model options creation
    Object.entries(modelObj.fields).map(async ([key, value]: any) => {
      const modelField = await this.utility.createMetaRecords('ModelField', {
        model: model._id,
        modelName: model.name,
        fieldName: key,
        type: value.type,
        createdBy: modelObj.ctx?.id,
        updatedBy: modelObj.ctx?.id,
        default: value.default,
        rounds: value.rounds,
        unique: value.unique,
        ref: value.ref,
        localField: value.localField,
        foreignField: value.foreignField,
        enumType: value.enumType,
        enumValues: value.enumValues,
        managed: value.managed,
      });
      console.log('Inside field entries');
      await Promise.all(
        Object.entries(value).map(async ([fkey, fvalue]: any) => {
          // skip field options
          if (this.skipFields.includes(fkey)) return;
          await this.utility.createMetaRecords('FieldOption', {
            model: model._id,
            modelField: modelField._id,
            fieldName: key,
            keyName: fkey,
            type: typeof fvalue,
            value: fvalue,
            managed: modelField.managed,
            prefix: modelField.prefix,
          });
          console.log('Inside field option entries');
        })
      );
    });
    Object.entries(modelObj.options).map(async ([key, value]: any) => {
      await this.utility.createMetaRecords('ModelOption', {
        model: model._id,
        modelName: model.name,
        managed: model.managed,
        keyName: key,
        value: value.value,
        type: value.type,
      });
      console.log('Inside model option entries');
    });
    // model options creation
    console.log('all entries are created');
  }

  private async modifyModelOptions(redisObj: any, modelObj: any) {
    const modelData = await this.mercury.db['Model'].get(
      { name: modelObj.name },
      { id: 'af', profile: 'SystemAdmin' }
    );
    const diffOptionObj = _.omitBy(modelObj.options, (value, key) => {
      return _.isEqual(value, redisObj.options[key]);
    });
    // Create and Update
    Object.entries(diffOptionObj).forEach(async ([key, value]: any) => {
      await this.createOrUpdateModelOptions(modelData, key, value);
    });
    // Delete - omitted
    await this.deleteModelOptions(
      Object.keys(_.omit(redisObj.options, Object.keys(modelObj.options))),
      modelData._id
    );
  }

  private async createOrUpdateModelOptions(
    modelData: any,
    keyName: string,
    value: any
  ) {
    const modelOption = await this.mercury.db['ModelOption'].get(
      { model: modelData._id, modelName: modelData.name, keyName: keyName },
      { id: 'aer', profile: 'SystemAdmin' }
    );
    if (_.isEmpty(modelOption)) {
      await this.mercury.db['ModelOption'].create(
        {
          model: modelData._id,
          modelName: modelData.name,
          keyName: keyName,
          value: value,
          type: typeof value,
        },
        { id: '123', profile: 'SystemAdmin' },
        { skipHook: true }
      );
    } else {
      if (modelOption.value == value) return;
      await this.mercury.db['ModelOption'].update(
        modelOption._id,
        { keyName: keyName, value: value, type: typeof value },
        { id: '123', profile: 'SystemAdmin' },
        { skipHook: true }
      );
    }
  }

  private async deleteModelOptions(deleteKeys: string[], model: string) {
    deleteKeys.map(async (deleteKey: string) => {
      await this.mercury.db['ModelOption'].mongoModel.deleteOne({
        model: model,
        keyName: deleteKey,
      });
    });
  }

  // private async createDefaultModelOptions(model: TMetaModel) {
  //   ['historyTracking', 'private'].map((option: string) => {
  //     createMetaRecords('ModelOption', {
  //       model: model._id,
  //       name: model.name,
  //       managed: false,
  //       keyName: option,
  //       value: false,
  //       type: "boolean",
  //     });
  //   })
  // }

  // private async deleteMetaRecords(model: any) {
  //   ['ModelField', 'ModelOption', 'FieldOption'].map(async (modelName: string) => {
  //     await this.mercury.db[modelName].mongoModel.deleteMany({
  //       model: model._id,
  //     });
  //   })
  // }

  // private subscribeToRecordHooks() {
  //   const _self = this;
  //   this.mercury.hook.before('UPDATE_MODEL_RECORD', async function (this: any) {
  //     if (this.record.managed) throw new Error(`This model can't be edited`);
  //   });
  //   this.mercury.hook.before('DELETE_MODEL_RECORD', async function (this: any) {
  //     if (this.record.managed) throw new Error(`This model can't be deleted!`);
  //   });
  //   this.mercury.hook.before('UPDATE_MODELFIELD_RECORD', async function (this: any) {
  //     if (this.record.managed) throw new Error(`This model field can't be edited!`);
  //   });
  //   this.mercury.hook.before('DELETE_MODELFIELD_RECORD', async function (this: any) {
  //     if (this.record.managed) throw new Error(`This model field can't be deleted!`);
  //   });
  //   this.mercury.hook.before('UPDATE_MODELOPTION_RECORD', async function (this: any) {
  //     if (this.record.managed) throw new Error(`This model option can't be edited!`);
  //   });
  //   this.mercury.hook.before('DELETE_MODELOPTION_RECORD', async function (this: any) {
  //     if (this.record.managed) throw new Error(`This model option can't be deleted!`);
  //   });
  //   this.mercury.hook.before('UPDATE_FIELDOPTION_RECORD', async function (this: any) {
  //     if (this.record.managed) throw new Error(`This field option can't be deeditedleted!`);
  //   });
  //   this.mercury.hook.before('DELETE_FIELDOPTION_RECORD', async function (this: any) {
  //     if (this.record.managed) throw new Error(`This field option  can't be deleted!`);
  //   });
  //   this.mercury.hook.after('CREATE_MODEL_RECORD', async function (this: any) {
  //     if (this.options.skipHook) return;
  //     // create options
  //     await _self.createDefaultModelOptions(this.record);
  //     _self.syncModel(this.record);
  //   });
  //   this.mercury.hook.after('UPDATE_MODEL_RECORD', async function (this: any) {
  //     if (this.options.skipHook) return;
  //     const record = await _self.mercury.db.Model.get(
  //       { _id: this.record._id },
  //       { id: '1', profile: 'SystemAdmin' }
  //     );
  //     _self.syncModel(record, this.prevRecord);
  //   });
  //   this.mercury.hook.after('DELETE_MODEL_RECORD', async function (this: any) {
  //     if (this.options.skipHook) return;
  //     // _self.mercury.deleteModel(this.deletedRecord.name);
  //     await _self.deleteMetaRecords(this.deletedRecord);
  //     await _self.delModel(this.deletedRecord.name);
  //   });
  //   this.mercury.hook.before(
  //     'CREATE_MODELFIELD_RECORD',
  //     async function (this: any) {
  //       if (this.options.skipHook) return;
  //       const model = await _self.mercury.db.Model.get({ _id: this.data.model }, { id: "1", profile: "SystemAdmin" });
  //       if (model.name !== this.data.name) throw new Error("Model name mismatch");
  //     }
  //   );
  //   this.mercury.hook.after(
  //     'CREATE_MODELFIELD_RECORD',
  //     async function (this: any) {
  //       if (this.options.skipHook) return;
  //       await _self.syncModelFields(this.record);
  //     }
  //   );
  //   this.mercury.hook.after(
  //     'UPDATE_MODELFIELD_RECORD',
  //     async function (this: any) {
  //       if (this.options.skipHook) return;
  //       const record = await _self.mercury.db.ModelField.get(
  //         { _id: this.record._id },
  //         { id: '1', profile: 'SystemAdmin' }
  //       );
  //       await _self.syncModelFields(record, this.prevRecord);
  //     }
  //   );

  //   this.mercury.hook.after(
  //     'DELETE_MODELFIELD_RECORD',
  //     async function (this: any) {
  //       if (this.options.skipHook) return;
  //       let redisObj: any = await _self.mercury.cache.get(
  //         this.deletedRecord.name.toUpperCase()
  //       );
  //       redisObj = JSON.parse(redisObj);
  //       delete redisObj.fields[this.deletedRecord.fieldName];
  //       await _self.setRedisAfterDel(redisObj);
  //     }
  //   );
  //   this.mercury.hook.before(
  //     'CREATE_MODELOPTION_RECORD',
  //     async function (this: any) {
  //       if (this.options.skipHook) return;
  //       const model = await _self.mercury.db.Model.get({ _id: this.data.model }, { id: "1", profile: "SystemAdmin" });
  //       if (model.name !== this.data.name) throw new Error("Model name mismatch");
  //     }
  //   );
  //   this.mercury.hook.after(
  //     'CREATE_MODELOPTION_RECORD',
  //     async function (this: any) {
  //       if (this.options.skipHook) return;
  //       await _self.syncModelOptions(this.record);
  //     }
  //   );
  //   this.mercury.hook.after(
  //     'UPDATE_MODELOPTION_RECORD',
  //     async function (this: any) {
  //       if (this.options.skipHook) return;
  //       const record = await _self.mercury.db.ModelOption.get(
  //         { _id: this.record._id },
  //         { id: '1', profile: 'SystemAdmin' }
  //       );
  //       await _self.syncModelOptions(record, this.prevRecord);
  //     }
  //   );
  //   this.mercury.hook.after(
  //     'DELETE_MODELOPTION_RECORD',
  //     async function (this: any) {
  //       if (this.options.skipHook) return;
  //       let redisObj: any = await _self.mercury.cache.get(
  //         this.deletedRecord.name.toUpperCase()
  //       );
  //       redisObj = JSON.parse(redisObj);
  //       delete redisObj.options[this.deletedRecord.keyName];
  //       await _self.setRedisAfterDel(redisObj);
  //     }
  //   );
  //   this.mercury.hook.before(
  //     'CREATE_FIELDOPTION_RECORD',
  //     async function (this: any) {
  //       if (this.options.skipHook) return;
  //       const model = await _self.mercury.db.Model.get({ _id: this.data.model }, { id: "1", profile: "SystemAdmin" });
  //       if (model.name !== this.data.modelName) throw new Error("Model name mismatch !!");
  //     }
  //   );
  //   this.mercury.hook.after(
  //     'CREATE_FIELDOPTION_RECORD',
  //     async function (this: any) {
  //       if (this.options.skipHook) return;
  //       await _self.syncFieldOptions(this.record);
  //     }
  //   );
  //   this.mercury.hook.after(
  //     'UPDATE_FIELDOPTION_RECORD',
  //     async function (this: any) {
  //       if (this.options.skipHook) return;
  //       const record = await _self.mercury.db.FieldOption.get(
  //         { _id: this.record._id },
  //         { id: '1', profile: 'SystemAdmin' }
  //       );
  //       await _self.syncFieldOptions(record, this.prevRecord);
  //     }
  //   );
  //   this.mercury.hook.after(
  //     'DELETE_FIELDOPTION_RECORD',
  //     async function (this: any) {
  //       if (this.options.skipHook) return;
  //       let redisObj: any = await _self.mercury.cache.get(
  //         this.deletedRecord.modelName.toUpperCase()
  //       );
  //       redisObj = JSON.parse(redisObj);
  //       delete redisObj.fields[this.deletedRecord.fieldName][
  //         this.deletedRecord.keyName
  //       ];
  //       await _self.setRedisAfterDel(redisObj);
  //     }
  //   );
  // }

  //   @AfterHook
  //   private async setRedisAfterDel(model: TModel) {
  //     await this.mercury.cache.set(
  //       `${model.name.toUpperCase()}`,
  //       JSON.stringify(model)
  //     );
  //   }

  //   @AfterHook
  //   private async syncModel(model: TMetaModel, prevRecord?: TMetaModel) {
  //     let redisObj: TModel = {} as TModel;
  //     if (_.isEmpty(prevRecord)) {
  //       redisObj = {
  //         name: model.name,
  //         fields: {},
  //         options: { historyTracking: false, private: false },
  //       };
  //     } else {
  //       if (prevRecord.name !== model.name) {
  //         // handle redis not present
  //         // name update -> update in associated model fields, model options
  //         await this.syncMetaModelRecords(model);
  //         redisObj = JSON.parse((await this.mercury.cache.get(prevRecord.name.toUpperCase())) as string);
  //         await this.delModel(prevRecord.name);
  //         redisObj.name = model.name;
  //       } else return;
  //     }
  //     let allModels: string[] = JSON.parse((await this.mercury.cache.get('ALL_MODELS')) as string);
  //     allModels.push(model.name);
  //     await this.mercury.cache.set(
  //       model.name.toUpperCase(),
  //       JSON.stringify(redisObj)
  //     );
  //     await this.mercury.cache.set('ALL_MODELS', JSON.stringify(allModels));
  //     if (!_.isEmpty(redisObj.fields))
  //       this.mercury.createModel(redisObj.name, redisObj.fields, redisObj.options);
  //   }

  //   private async syncMetaModelRecords(model: TMetaModel) {
  //     await this.mercury.db.ModelField.mongoModel.updateMany({ model: model._id }, { $set: { name: model.name } });
  //     await this.mercury.db.ModelOption.mongoModel.updateMany({ model: model._id }, { $set: { name: model.name } });
  //     await this.mercury.db.FieldOption.mongoModel.updateMany({ model: model._id }, { $set: { modelName: model.name } });
  //   }

  //   @AfterHook
  //   private async delModel(model: string) {
  //     let allModels: string[] = JSON.parse(await this.mercury.cache.get('ALL_MODELS') as string);
  //     allModels = allModels.filter((rmodel: string) => rmodel !== model);
  //     await this.mercury.cache.delete(model.toUpperCase());
  //     await this.mercury.cache.set('ALL_MODELS', JSON.stringify(allModels));
  //   }

  //   @AfterHook
  //   private async syncModelFields(modelField: TModelField, prevRecord?: TModelField) {
  //     // if not present , need to fetch from db and compose again?
  //     let redisObj: TModel = JSON.parse(await this.mercury.cache.get(modelField.modelName.toUpperCase()) as string);
  //     if (!_.isEmpty(prevRecord)) {
  //       delete redisObj.fields[prevRecord.fieldName];
  //     }
  //     const fieldSchema = this.composeSchema([modelField]);
  //     redisObj.fields[modelField.fieldName] = fieldSchema[modelField.fieldName];
  //     await this.mercury.cache.set(
  //       `${redisObj.name.toUpperCase()}`,
  //       JSON.stringify(redisObj)
  //     );
  //     this.mercury.createModel(redisObj.name, redisObj.fields, redisObj.options);
  //   }

  //   @AfterHook
  //   private async syncModelOptions(record: TModelOption, prevRecord?: TModelOption) {
  //     let redisObj: TModel = JSON.parse(await this.mercury.cache.get(record.name.toUpperCase()) as string);
  //     if (!_.isEmpty(prevRecord)) {
  //       delete redisObj?.options?.[prevRecord.keyName];
  //     }
  //     const options = this.composeOptions([record]);
  //     (redisObj.options as TOptions)[record.keyName] = record.value;
  //     await this.mercury.cache.set(
  //       `${redisObj.name.toUpperCase()}`,
  //       JSON.stringify(redisObj)
  //     );
  //     this.mercury.createModel(redisObj.name, redisObj.fields, redisObj.options);
  //   }

  //   @AfterHook
  //   private async syncFieldOptions(fieldOption: TFieldOption, prevRecord?: TFieldOption) {
  //     let redisObj: TModel = JSON.parse(await this.mercury.cache.get(fieldOption.modelName.toUpperCase()) as string);
  //     if (!_.isEmpty(prevRecord)) {
  //       delete redisObj.fields[fieldOption.fieldName][prevRecord.keyName];
  //     }
  //     redisObj.fields[fieldOption.fieldName][fieldOption['keyName']] =
  //       fieldOption.value;
  //     await this.mercury.cache.set(
  //       `${redisObj.name.toUpperCase()}`,
  //       JSON.stringify(redisObj)
  //     );
  //     this.mercury.createModel(redisObj.name, redisObj.fields, redisObj.options);
  //   }

}

// export type { Platform };

// managed true -> before hooks condition checks
// delete hooks - afterHook decorator