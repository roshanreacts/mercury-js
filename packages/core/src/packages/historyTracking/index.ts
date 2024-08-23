import { historySchema } from '../../utility';
import { Mercury } from '../../mercury';
import mongoose from 'mongoose';
const { Types } = mongoose;
import _ from 'lodash';

export interface MercuryHistoryPkgConfig {
  skipModels?: Array<string>;
}
export default (config?: MercuryHistoryPkgConfig) => {
  return async (mercury: Mercury) => {
    if (!config) {
      config = {
        skipModels: [],
      };
    }
    createHistory(config, mercury);
  };
};

const createHistory = (config: MercuryHistoryPkgConfig, mercury: Mercury) => {
  const models: TModel[] = mercury.list.filter(
    (model: TModel) =>
      model.options?.historyTracking === true &&
      !config?.skipModels?.includes(model.name)
  );
  models.map((model: TModel) => {
    mercury.createModel(`${model.name}History`, historySchema(model.name), {
      historyTracking: false,
    });
  });
  models.map((model: TModel) => {
    mercury.hook.after(
      `UPDATE_${model.name.toUpperCase()}_RECORD`,
      function (this: any) {
        const instanceId = getInstanceId();
        Object.entries(this.data).map(async ([key, value]: [string, any]) => {
          if (
            !_.isEqual(
              ifStringAndNotNull(this.prevRecord[key]),
              ifStringAndNotNull(value)
            )
          ) {
            await createHistoryRecord(
              mercury,
              `${model.name}History`,
              this.prevRecord[key],
              value,
              instanceId,
              'UPDATE',
              getDataType(model, key),
              this.prevRecord._id,
              key,
              this.user
            );
          }
        });
      }
    );
    mercury.hook.after(
      `DELETE_${model.name.toUpperCase()}_RECORD`,
      function (this: any) {
        const instanceId = getInstanceId();
        const skipFields = ['id', '_id', 'createdOn', 'updatedOn', '__v'];
        Object.entries(this.deletedRecord['_doc']).map(
          async ([key, value]: [string, any]) => {
            if (skipFields.includes(key)) return;
            await createHistoryRecord(
              mercury,
              `${model.name}History`,
              value,
              'UNKNOWN',
              instanceId,
              'DELETE',
              getDataType(model, key),
              this.deletedRecord._id,
              key,
              this.user
            );
          }
        );
      }
    );
  });
};

function getDataType(model: TModel, key: string) {
  return ['relationship', 'virtual'].includes(model.fields[key]?.type)
    ? model.fields[key].ref
    : model.fields[key].type;
}

function getInstanceId() {
  return new Types.ObjectId();
}

async function createHistoryRecord(
  mercury: Mercury,
  model: any,
  oldValue: any,
  newValue: any,
  instanceId: any,
  operationType: String,
  dataType: any,
  recordId: String,
  fieldName: String,
  ctx: any
) {

  // setting context
  const historyRecord = await mercury.db[model].mongoModel.create(
    {
      recordId: recordId,
      operationType: operationType,
      instanceId: instanceId,
      dataType: dataType,
      fieldName: fieldName,
      newValue: ifStringAndNotNull(newValue),
      oldValue: ifStringAndNotNull(oldValue),
    }
  );
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
