import { historySchema } from '../../utility';
import { Mercury } from '../../mercury';
import { Types } from "mongoose";

export interface MercuryHistoryPkgConfig {
  skipModels?: Array<string>;
}
export default (config?: MercuryHistoryPkgConfig) => {
  return (mercury: Mercury) => {
    if (!config) {
      config = {
        skipModels: []
      }
    }
    createHistory(config, mercury);
  };
};

const createHistory = (config: MercuryHistoryPkgConfig, mercury: Mercury) => {
  const models: TModel[] = mercury.list.filter((model: TModel) => model.options?.historyTracking === true && !config?.skipModels?.includes(model.name));
  models.map((model: TModel) => {
    mercury.createModel(`${model.name}History`, historySchema(model.name), { historyTracking: false })
  })
  models.map((model: TModel) => {
    mercury.hook.after(`UPDATE_${model.name.toUpperCase()}_RECORD`, function (this: any) {
      const instanceId = new Types.ObjectId();
      Object.keys(model.fields).map((key: string) => {
        if (this.prevRecord[key] !== this.record[key]) {
          console.log("Not equal", key, this.options.args.input);
          createHistoryRecord(mercury, `${model.name}History`, this.prevRecord[key], this.record[key], instanceId, "UPDATE", typeof this.prevRecord[key], this.prevRecord._id, key, this.user)
        }
      })
    })
  })
  // Filter mercury.list and get the models which has option historyTracking enabled
  // Iterate through the models and createModel with history generic model schema
  // iterate through filtered models and call mercury.hooks.after(${model.name}_RECORD_UPDATE, (this:any) => createHis(mercury, this, model,Name))
  // add models to profile dynamically to view the records
}


function createHistoryRecord(mercury: Mercury, model: any, oldValue: any, newValue: any, instanceId: any, operationType: String, dataType: String, recordId: String, fieldName: String, ctx: any) {
  console.log("Creating records");
  mercury.db[model].create({
    recordId: recordId,
    operationType: operationType,
    instanceId: instanceId,
    dataType: dataType,
    fieldName: fieldName,
    newValue: newValue ?? "UNKNOWN",
    oldValue: oldValue ?? "UNKNOWN"
  },
  ctx, 
  {});
}

