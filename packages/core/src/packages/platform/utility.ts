import { Platform } from ".";
import mercury from "../../mercury";

export const  composeSchema = (
  modelFields: TModelField[],
  fieldOptions?: TFieldOption[]
) => {
  const skipFields = [
    'id',
    '_id',
    'type',
    'fieldName',
    'model',
    'name',
    'createdBy',
    'updatedBy',
    'managed',
    'fieldOptions',
    'createdOn',
    'updatedOn',
    '__v',
  ];
  let schema: any = {};
  modelFields.map((modelField: any) => {
    const fieldName = modelField['fieldName'];
    const fieldObj: TField = { type: modelField['type'] };
    Object.keys(modelField['_doc']).map((key: string) => {
      // Return for some fields
      if (skipFields.includes(key)) return;
      if (
        key != 'enumValues' ||
        (key == 'enumValues' && modelField[key].length)
      )
        fieldObj[key] = modelField[key];
    });
    if (fieldOptions) {
      const fieldOption = fieldOptions.filter((fieldOption: any) =>
        fieldOption.modelField.equals(modelField._id)
      );
      fieldOption.map((option: TFieldOption) => {
        let type = option.type;
        let value = option.value;
        fieldObj[option.keyName] =
          type == 'number'
            ? Number(value)
            : type == 'string'
              ? String(value)
              : value === 'true';
      });
    }
    schema[fieldName] = fieldObj;
  });
  return schema;
}

export const composeOptions = (modelOptions: TModelOption[]) => {
  let options: any = {};
  console.log('modelOptions', modelOptions);
  modelOptions.map((modelOption: TModelOption) => {
    let type = modelOption.type;
    let value = modelOption.value;
    options[modelOption.keyName] =
      type == 'number'
        ? Number(value)
        : type == 'string'
          ? String(value)
          : type == 'boolean'
            ? value === 'true'
            : value;
  });
  return options;
}

export const createDefaultModelOptions = async (model: TMetaModel) => {
  ['historyTracking', 'private'].map((option: string) => {
    createMetaRecords('ModelOption', {
      model: model._id,
      name: model.name,
      managed: false,
      keyName: option,
      value: false,
      type: "boolean",
    });
  })
}

export const createMetaRecords = async(modelName: string, data: any) => {
  return await mercury.db[modelName].create(
    data,
    {
      id: 'q2',
      profile: 'Admin',
    },
    { skipHook: true }
  );
}


export function AfterHook(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (this: Platform, ...args: any[]) {
    try {
      // before hook
      // after hook
      const result = originalMethod.apply(this, args);
      if (result instanceof Promise) {
        return result.then(async (res: any) => {
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
          return res;
        });
      } else {
        return result;
      }
    } catch (error: any) {
      console.log('Platform Error: ', error);
    }
  };

  return descriptor;
}