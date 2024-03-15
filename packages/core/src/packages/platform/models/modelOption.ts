import _ from "lodash";
import mercury from "../../../mercury";
import { AfterHook, composeOptions } from "../utility";
export class ModelOption {
    constructor() {
        this.createModelOptions();
        this.subscribeHooks();
    }
    private createModelOptions() {
        mercury.createModel(
            "ModelOptions",
            {
                model: {
                    type: 'relationship',
                    ref: 'Model',
                    required: true,
                },
                name: {
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
        mercury.hook.before('DELETE_MODELOPTION_RECORD', async function (this: any) {
            if (this.record.managed) throw new Error(`This model option can't be deleted!`);
        });
        mercury.hook.after(
            'DELETE_MODELOPTION_RECORD',
            async function (this: any) {
                if (this.options.skipHook) return;
                let redisObj: any = await mercury.cache.get(
                    this.deletedRecord.name.toUpperCase()
                );
                redisObj = JSON.parse(redisObj);
                delete redisObj.options[this.deletedRecord.keyName];
                await _self.setRedisAfterDel(redisObj);
            }
        );
    }
    private updateModelOptionHook() {
        const _self = this;
        mercury.hook.before('UPDATE_MODELOPTION_RECORD', async function (this: any) {
            if (this.record.managed) throw new Error(`This model option can't be edited!`);
        });

        mercury.hook.after(
            'UPDATE_MODELOPTION_RECORD',
            async function (this: any) {
                if (this.options.skipHook) return;
                const record = await mercury.db.ModelOption.get(
                    { _id: this.record._id },
                    { id: '1', profile: 'Admin' }
                );
                await _self.syncModelOptions(record, this.prevRecord);
            }
        );
    }
    private createModelOptionHook() {
        const _self = this;
        mercury.hook.before(
            'CREATE_MODELOPTION_RECORD',
            async function (this: any) {
                if (this.options.skipHook) return;
                const model = await mercury.db.Model.get({ _id: this.data.model }, { id: "1", profile: "Admin" });
                if (model.name !== this.data.name) throw new Error("Model name mismatch");
            }
        );

        mercury.hook.after(
            'CREATE_MODELOPTION_RECORD',
            async function (this: any) {
                if (this.options.skipHook) return;
                await _self.syncModelOptions(this.record);
            }
        );
    }


    //after hook should be called (decorator)
    @AfterHook
    private async syncModelOptions(record: TModelOption, prevRecord?: TModelOption) {
        let redisObj: TModel = JSON.parse(await mercury.cache.get(record.name.toUpperCase()) as string);
        if (!_.isEmpty(prevRecord)) {
            delete redisObj?.options?.[prevRecord.keyName];
        }
        const options = composeOptions([record]);
        (redisObj.options as TOptions)[record.keyName] = record.value;
        await mercury.cache.set(
            `${redisObj.name.toUpperCase()}`,
            JSON.stringify(redisObj)
        );
        mercury.createModel(redisObj.name, redisObj.fields, redisObj.options);
    }


    // after hook should be called (decorator)
    @AfterHook
    private async setRedisAfterDel(model: TModel) {
        await mercury.cache.set(
            `${model.name.toUpperCase()}`,
            JSON.stringify(model)
        );
    }
}