import mercury from "../../../mercury";
import type { Mercury } from '../../../mercury';
import _ from "lodash";
import { AfterHook, Utility } from "../utility"

export class ModelField {
  protected mercury: Mercury;
  protected utility;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
    this.utility = new Utility(this.mercury);
    this.createModelField();
    this.subscribeHooks();
  }

  private async createModelField() {
    this.mercury.createModel(
      'ModelField',
      {
        model: {
          type: 'relationship',
          ref: 'Model',
          required: true,
        },
        modelName: {
          type: 'string',
          required: true,
        },
        createdBy: {
          type: 'relationship',
          ref: 'User',
          // required: true,
        },
        updatedBy: {
          type: 'relationship',
          ref: 'User',
          // required: true,
        },
        fieldName: {
          type: 'string',
          required: true,
        },
        label: {
          type: 'string',
          required: true,
        },
        type: { // need to a look on this
          type: 'enum',
          enum: ['number', 'string', 'boolean', 'relationship', 'virtual', 'date', 'float', 'enum'],
          enumType: 'string',
          required: true,
        },
        required: {
          type: 'boolean',
        },
        many: {
          type: 'boolean',
          default: false,
        },
        default: {
          type: 'string',
        },
        rounds: {
          type: 'number',
        },
        unique: {
          type: 'boolean',
        },
        ref: {
          type: 'string',
        },
        localField: {
          type: 'string',
        },
        foreignField: {
          type: 'string',
        },
        enumType: {
          type: 'string',
        },
        enumValues: {
          type: 'string',
          many: true,
        },
        managed: {
          type: 'boolean',
          required: true,
          default: true
        },
        fieldOptions: {
          type: 'virtual',
          ref: 'FieldOption',
          localField: 'modelField',
          foreignField: '_id',
          many: true,
        },
      },
      {
        historyTracking: false,
        indexes: [
          {
            fields: {
              model: 1,
              fieldName: 1,
            },
            options: {
              unique: true,
            },
          },
        ],
      }
    );
  }

  private subscribeHooks() {
    this.createModelFieldHook();
    this.updateModelFieldHook();
    this.deleteModelFieldHook();
  }

  private async createModelFieldHook() {
    const _self = this;
    this.mercury.hook.before(
      'CREATE_MODELFIELD_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        const model = await _self.mercury.db.Model.get({ _id: this.data.model }, { id: "1", profile: "SystemAdmin" });
        if (model.name !== this.data.modelName) throw new Error("Model name mismatch");
      }
    );
    this.mercury.hook.after(
      'CREATE_MODELFIELD_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        const modelField = await _self.mercury.db.ModelField.get({ _id: this.record._id }, { id: "1", profile: "SystemAdmin" });
        await _self.syncModelFields(modelField);
      }
    );
  }

  private updateModelFieldHook() {
    const _self = this;
    this.mercury.hook.before('UPDATE_MODELFIELD_RECORD', async function (this: any) {
      if (this.record.managed) throw new Error(`This model field can't be edited!`);
    });
    this.mercury.hook.after(
      'UPDATE_MODELFIELD_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        const record = await _self.mercury.db.ModelField.get(
          { _id: this.record._id },
          { id: '1', profile: 'SystemAdmin' }
        );
        await _self.syncModelFields(record, this.prevRecord);
      }
    );
  }

  private deleteModelFieldHook() {
    const _self = this;
    this.mercury.hook.before('DELETE_MODELFIELD_RECORD', async function (this: any) {
      const modelFields = await _self.mercury.db.ModelField.list(
        { model: this.record.model },
        { id: '1', profile: 'SystemAdmin' }
      );
      if (modelFields.length == 1) throw new Error('Model has only one field thus it cant be deleted');
      if (this.record.managed) throw new Error(`This model field can't be deleted!`);
    });
    this.mercury.hook.after(
      'DELETE_MODELFIELD_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        let redisObj: TModel = JSON.parse(await _self.mercury.cache.get(
          this.deletedRecord.modelName.toUpperCase()
        ) as string);
        await _self.syncModelFieldOptions(this.deletedRecord);
        delete redisObj.fields[this.deletedRecord.fieldName];
        await _self.setRedisAfterDel(redisObj);
      }
    );
  }

  // after hook needs to be present
  @AfterHook
  private async syncModelFields(modelField: TModelField, prevRecord?: TModelField) {
    let redisObj: TModel = JSON.parse(await this.mercury.cache.get(modelField.modelName.toUpperCase()) as string);
    if (!_.isEmpty(prevRecord)) {
      delete redisObj.fields[prevRecord.fieldName];
    }
    const fieldSchema = this.utility.composeSchema([modelField]);
    redisObj.fields[modelField.fieldName] = fieldSchema[modelField.fieldName];
    await this.mercury.cache.set(
      `${redisObj.name.toUpperCase()}`,
      JSON.stringify(redisObj)
    );
    this.mercury.createModel(redisObj.name, redisObj.fields, { ...redisObj.options, update: redisObj.name in this.mercury.db } as TOptions);
  }

  @AfterHook
  private async setRedisAfterDel(redisObj: TModel) {
    await this.mercury.cache.set(
      `${redisObj.name.toUpperCase()}`,
      JSON.stringify(redisObj)
    );
    this.mercury.createModel(redisObj.name, redisObj.fields, { ...redisObj.options, update: true } as TOptions);
  }

  private async syncModelFieldOptions(modelField: TModelField) {
    await this.mercury.db['FieldOption'].mongoModel.deleteMany({
      modelField: modelField._id,
    });
  }
}

// compose schema is an utility method? - done