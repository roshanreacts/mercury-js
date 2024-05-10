import _ from "lodash";
import mercury from "../../../mercury";
import type { Mercury } from '../../../mercury';
import { AfterHook, Utility } from "../utility";
export class ModelOption {
  protected mercury: Mercury;
  protected utility;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
    this.utility = new Utility(this.mercury);
    this.createModelOptions();
    this.subscribeHooks();
  }
  private createModelOptions() {
    this.mercury.createModel(
      "ModelOption",
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
        managed: {
          type: 'boolean',
          required: true,
          default: true
        },
        keyName: {
          type: 'string',
          required: true,
        },
        value: {
          type: 'string',
          required: true,
        },
        type: {
          type: 'enum',
          enum: ['number', 'string', 'boolean'],
          enumType: 'string',
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
      },
      {
        historyTracking: false
      }
    )
  }
  private subscribeHooks() {
    this.createModelOptionHook();
    this.updateModelOptionHook();
    this.deleteModelOptionHook();
  }

  private deleteModelOptionHook() {
    const _self = this;
    this.mercury.hook.before('DELETE_MODELOPTION_RECORD', async function (this: any) {
      if (this.record.managed) throw new Error(`This model option can't be deleted!`);
    });
    this.mercury.hook.after(
      'DELETE_MODELOPTION_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        let redisObj: any = await _self.mercury.cache.get(
          this.deletedRecord.modelName.toUpperCase()
        );
        redisObj = JSON.parse(redisObj);
        delete redisObj.options[this.deletedRecord.keyName];
        await _self.setRedisAfterDel(redisObj);
      }
    );
  }
  private updateModelOptionHook() {
    const _self = this;
    this.mercury.hook.before('UPDATE_MODELOPTION_RECORD', async function (this: any) {
      if (this.record.managed) throw new Error(`This model option can't be edited!`);
    });

    this.mercury.hook.after(
      'UPDATE_MODELOPTION_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        const record = await _self.mercury.db.ModelOption.get(
          { _id: this.record._id },
          { id: '1', profile: 'Admin' }
        );
        await _self.syncModelOptions(record, this.prevRecord);
      }
    );
  }
  private createModelOptionHook() {
    const _self = this;
    this.mercury.hook.before(
      'CREATE_MODELOPTION_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        const model = await _self.mercury.db.Model.get({ _id: this.data.model }, { id: "1", profile: "Admin" });
        if (model.name !== this.data.modelName) throw new Error("Model name mismatch");
      }
    );

    this.mercury.hook.after(
      'CREATE_MODELOPTION_RECORD',
      async function (this: any) {
        if (this.options.skipHook) return;
        const modelOption = await _self.mercury.db.ModelOption.get({ _id: this.record._id }, { id: "1", profile: "Admin" });
        await _self.syncModelOptions(modelOption);
      }
    );
  }


  //after hook should be called (decorator)
  @AfterHook
  private async syncModelOptions(record: TModelOption, prevRecord?: TModelOption) {
    let redisObj: TModel = JSON.parse(await this.mercury.cache.get(record.modelName.toUpperCase()) as string);
    if (!_.isEmpty(prevRecord)) {
      delete redisObj?.options?.[prevRecord.keyName];
    }
    const options = this.utility.composeOptions([record]);
    (redisObj.options as TOptions)[record.keyName] = record.value;
    await this.mercury.cache.set(
      `${redisObj.name.toUpperCase()}`,
      JSON.stringify(redisObj)
    );
    this.mercury.createModel(redisObj.name, redisObj.fields,  { ...redisObj.options, update: true } as TOptions);
  }


  // after hook should be called (decorator)
  @AfterHook
  private async setRedisAfterDel(model: TModel) {
    await this.mercury.cache.set(
      `${model.name.toUpperCase()}`,
      JSON.stringify(model)
    );
  }
}