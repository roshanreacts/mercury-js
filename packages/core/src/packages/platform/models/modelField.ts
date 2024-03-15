import mercury from "../../../mercury";
import _ from "lodash";
import { AfterHook, composeSchema } from "../utility"

export class ModelField {
  constructor() {
    this.createModel();
    this.subscribeHooks();
  }

  private async createModel() {
    mercury.createModel(
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
        type: {
          type: 'enum',
          enum: ['number', 'string', 'boolean'],
          enumType: 'string',
          required: true,
        },
        required: {
          type: 'boolean',
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
    mercury.hook.before(
      'CREATE_MODELFIELD_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        const model = await mercury.db.Model.get({ _id: this.data.model }, { id: "1", profile: "Admin" });
        if (model.name !== this.data.name) throw new Error("Model name mismatch");
      }
    );
    mercury.hook.after(
      'CREATE_MODELFIELD_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        await _self.syncModelFields(this.record);
      }
    );
  }

  private updateModelFieldHook() {
    const _self = this;
    mercury.hook.before('UPDATE_MODELFIELD_RECORD', async function (this: any) {
      if (this.record.managed) throw new Error(`This model field can't be edited!`);
    });
    mercury.hook.after(
      'UPDATE_MODELFIELD_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        const record = await mercury.db.ModelField.get(
          { _id: this.record._id },
          { id: '1', profile: 'Admin' }
        );
        await _self.syncModelFields(record, this.prevRecord);
      }
    );
  }

  private deleteModelFieldHook() {
    mercury.hook.before('DELETE_MODELFIELD_RECORD', async function (this: any) {
      if (this.record.managed) throw new Error(`This model field can't be deleted!`);
    });
    mercury.hook.after(
      'DELETE_MODELFIELD_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        let redisObj: TModel = JSON.parse(await mercury.cache.get(
          this.deletedRecord.name.toUpperCase()
        ) as string);
        delete redisObj.fields[this.deletedRecord.fieldName];
        await mercury.cache.set(
          `${redisObj.name.toUpperCase()}`,
          JSON.stringify(redisObj)
        );
      }
    );
  }

  // after hook needs to be present
  @AfterHook
  private async syncModelFields(modelField: TModelField, prevRecord?: TModelField) {
    let redisObj: TModel = JSON.parse(await mercury.cache.get(modelField.modelName.toUpperCase()) as string);
    if (!_.isEmpty(prevRecord)) {
      delete redisObj.fields[prevRecord.fieldName];
    }
    const fieldSchema = composeSchema([modelField]);
    redisObj.fields[modelField.fieldName] = fieldSchema[modelField.fieldName];
    await mercury.cache.set(
      `${redisObj.name.toUpperCase()}`,
      JSON.stringify(redisObj)
    );
    mercury.createModel(redisObj.name, redisObj.fields, redisObj.options);
  }

}

// compose schema is an utility method? - done