import _ from "lodash";
import mercury from "src/mercury";
import { AfterHook } from "../utility";

export class FieldOption {
    constructor() {
        this.createFieldOptions();
        this.subscribeHooks();
    }
    private createFieldOptions() {
        mercury.createModel(
            "FieldOption",
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
                modelField: {
                    type: 'relationship',
                    ref: 'ModelField',
                    required: true,
                },
                fieldName: {
                    type: 'string',
                    required: true,
                },
                keyName: {
                    type: 'string',
                    required: true,
                },
                type: {
                    type: 'enum',
                    enum: ['number', 'string', 'boolean'],
                    enumType: 'string',
                    required: true,
                },
                value: {
                    type: 'string',
                    required: true,
                },
                managed: {
                    type: 'boolean',
                    required: true,
                    default: true
                },
                prefix: {
                    type: 'string',
                    default: 'CUSTOM',
                },
            },
            {
                historyTracking: false
            }
        )
    }
    private subscribeHooks() {
        this.createFieldOptionHook();
        this.updateFieldOptionHook();
        this.deleteFieldOptionHook();
    }
    private deleteFieldOptionHook() {
        const _self = this;
        mercury.hook.before('DELETE_FIELDOPTION_RECORD', async function (this: any) {
            if (this.record.managed) throw new Error(`This field option  can't be deleted!`);
        });
        mercury.hook.after(
            'DELETE_FIELDOPTION_RECORD',
            async function (this: any) {
                if (this.options.skipHook) return;
                let redisObj: any = await mercury.cache.get(
                    this.deletedRecord.modelName.toUpperCase()
                );
                redisObj = JSON.parse(redisObj);
                delete redisObj.fields[this.deletedRecord.fieldName][
                    this.deletedRecord.keyName
                ];
                await _self.setRedisAfterDel(redisObj);
            }
        );
    }
    private updateFieldOptionHook() {
        const _self = this;
        mercury.hook.before('UPDATE_FIELDOPTION_RECORD', async function (this: any) {
            if (this.record.managed) throw new Error(`This field option can't be deeditedleted!`);
        });
        mercury.hook.after(
            'UPDATE_FIELDOPTION_RECORD',
            async function (this: any) {
                if (this.options.skipHook) return;
                const record = await mercury.db.FieldOption.get(
                    { _id: this.record._id },
                    { id: '1', profile: 'Admin' }
                );
                await _self.syncFieldOptions(record, this.prevRecord);
            }
        );
    }
    private createFieldOptionHook() {
        const _self = this;
        mercury.hook.before(
            'CREATE_FIELDOPTION_RECORD',
            async function (this: any) {
                if (this.options.skipHook) return;
                const model = await mercury.db.Model.get({ _id: this.data.model }, { id: "1", profile: "Admin" });
                if (model.name !== this.data.modelName) throw new Error("Model name mismatch !!");
            }
        );
        mercury.hook.after(
            'CREATE_FIELDOPTION_RECORD',
            async function (this: any) {
                if (this.options.skipHook) return;
                await _self.syncFieldOptions(this.record);
            }
        );
    }

    // after hook should be called (decorators)
    @AfterHook
    private async syncFieldOptions(fieldOption: TFieldOption, prevRecord?: TFieldOption) {
        let redisObj: TModel = JSON.parse(await mercury.cache.get(fieldOption.modelName.toUpperCase()) as string);
        if (!_.isEmpty(prevRecord)) {
            delete redisObj.fields[fieldOption.fieldName][prevRecord.keyName];
        }
        redisObj.fields[fieldOption.fieldName][fieldOption['keyName']] =
            fieldOption.value;
        await mercury.cache.set(
            `${redisObj.name.toUpperCase()}`,
            JSON.stringify(redisObj)
        );
        mercury.createModel(redisObj.name, redisObj.fields, redisObj.options);
    }

    // after hook should be called (decorators)
    @AfterHook
    private async setRedisAfterDel(model: TModel) {
        await mercury.cache.set(
            `${model.name.toUpperCase()}`,
            JSON.stringify(model)
        );
    }
}