import { historySchema } from '../../utility';
import { Mercury } from '../../mercury';
import { Types } from "mongoose";
import _ from "lodash";

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
      Object.keys(this.data).map((key: string) => {
        const value = this.data[key];
        if (!_.isEqual(ifStringAndNotNull(this.prevRecord[key]), ifStringAndNotNull(value))) {
          let dataType = ["relationship", "virtual"].includes(model.fields[key]?.type) ? model.fields[key].ref : model.fields[key].type;
          createHistoryRecord(mercury, `${model.name}History`, this.prevRecord[key], value, instanceId, "UPDATE", dataType, this.prevRecord._id, key, this.user)
        }
      })
    });
    mercury.hook.after(`DELETE_${model.name.toUpperCase()}_RECORD`, function (this: any) {
      // What fields are updataed or history itself gets deleted?
    })
  })
}


function createHistoryRecord(mercury: Mercury, model: any, oldValue: any, newValue: any, instanceId: any, operationType: String, dataType: any, recordId: String, fieldName: String, ctx: any) {
  mercury.db[model].create({
    recordId: recordId,
    operationType: operationType,
    instanceId: instanceId,
    dataType: dataType,
    fieldName: fieldName,
    newValue: ifStringAndNotNull(newValue),
    oldValue: ifStringAndNotNull(oldValue)
  },
    ctx,
    {});
}

function ifStringAndNotNull(value: any): string {
  if (value == null || value.length == 0 || value == undefined) {
    value = 'UNKNOWN';
  }
  if (typeof value !== 'string') {
    value = value.toString();
  }
  return value;
}
