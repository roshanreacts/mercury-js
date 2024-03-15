import mercury from "../../../mercury";
import _ from 'lodash';
import { AfterHook, createDefaultModelOptions } from "../utility";

export class Model {
  constructor() {
    this.createModel();
    this.subscribeHooks();
  }

  private createModel() {
    mercury.createModel(
      'Model',
      {
        name: {
          type: 'string',
          unique: true,
          required: true,
        },
        label: {
          type: 'string',
          unique: true,
          required: true,
        },
        prefix: {
          type: 'string',
          required: true,
        },
        managed: {
          type: 'boolean',
          required: true,
          default: true
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
        historyTracking: false,
        indexes: [
          {
            fields: {
              name: 1,
              prefix: 1,
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
    this.createModelHook();
    this.updateModelHook();
    this.deleteModelHook();
  }

  private createModelHook() {
    const _self = this;
    mercury.hook.after('CREATE_MODEL_RECORD', async function (this: any) {
      if (this.options.skipHook) return;
      // create options
      await createDefaultModelOptions(this.record);
      _self.syncModel(this.record);
    });
  }

  private updateModelHook() {
    const _self = this; 
    mercury.hook.before('UPDATE_MODEL_RECORD', async function (this: any) {
      if(this.record.managed) throw new Error(`This model can't be edited`);
    });
    mercury.hook.after('UPDATE_MODEL_RECORD', async function (this: any) {
      if (this.options.skipHook) return;
      const record = await mercury.db.Model.get(
        { _id: this.record._id },
        { id: '1', profile: 'Admin' }
      );
      _self.syncModel(record, this.prevRecord);
    });
  }

  private deleteModelHook() {
    const _self = this;
    mercury.hook.before('DELETE_MODEL_RECORD', async function (this: any) {
      if(this.record.managed) throw new Error(`This model can't be deleted!`);
    });
    mercury.hook.after('DELETE_MODEL_RECORD', async function (this: any) {
      if (this.options.skipHook) return;
      // _self.mercury.deleteModel(this.deletedRecord.name);
			await _self.deleteMetaRecords(this.deletedRecord);
      await _self.delModel(this.deletedRecord.name);
    });
  }

  // after hook 
  @AfterHook
  private async syncModel(model: TMetaModel, prevRecord?: TMetaModel) {
    let redisObj: TModel = {} as TModel;
    if (_.isEmpty(prevRecord)) {
      redisObj = {
        name: model.name,
        fields: {},
        options: { historyTracking: false, private: false },
      };
    } else {
      if (prevRecord.name !== model.name) {
        // handle redis not present
        // name update -> update in associated model fields, model options
        redisObj = JSON.parse((await mercury.cache.get(prevRecord.name.toUpperCase())) as string);
        await this.delModel(prevRecord.name);
        redisObj.name = model.name;
      } else return;
    }
    let allModels: string[] = JSON.parse((await mercury.cache.get('ALL_MODELS')) as string);
    allModels.push(model.name);
    await mercury.cache.set(
      model.name.toUpperCase(),
      JSON.stringify(redisObj)
    );
    await mercury.cache.set('ALL_MODELS', JSON.stringify(allModels));
    mercury.createModel(redisObj.name, redisObj.fields, redisObj.options);
  }

  @AfterHook
  private async delModel(model: string) {
    let allModels: string[] = JSON.parse(await mercury.cache.get('ALL_MODELS') as string);
    allModels = allModels.filter((rmodel: string) => rmodel !== model);
    await mercury.cache.delete(model.toUpperCase());
    await mercury.cache.set('ALL_MODELS', JSON.stringify(allModels));
  }

  private async deleteMetaRecords(model: any) {
		['ModelField', 'ModelOption', 'FieldOption'].map(async (modelName: string) => {
			await mercury.db[modelName].mongoModel.deleteMany({
				model: model._id,
			});
		})
	}
}