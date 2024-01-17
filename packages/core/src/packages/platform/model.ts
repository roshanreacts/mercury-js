import type { Mercury } from '../../mercury';

export default (mercury: Mercury) => {
  const Model = mercury.createModel("Model",
    {
      name: {
        type: "string",
        unique: true,
      },
      // prefix: {
      //   type: "string"
      // },
      // managed: {
      //   type: "boolean",
      // },
      // createdBy: {
      //   type: "relationship",
      //   ref: "User"
      // },
      // updatedBy: {
      //   type: "relationship",
      //   ref: "User"
      // },
    },
    {
      historyTracking: false
    });
  const ModelField = mercury.createModel("ModelField",
    {
      model: {
        type: "relationship",
        ref: "Model",
      },
      // name: {
      //   type: "string"
      // },
      // createdBy: {
      //   type: "relationship",
      //   ref: "User"
      // },
      // updatedBy: {
      //   type: "relationship",
      //   ref: "User"
      // },
      // fieldName: {
      //   type: "string"
      // },
      // type: {
      //   type: "string"
      // },
      // required: {
      //   type: "boolean",
      // },
      // default: {
      //   type: "string"
      // },
      // rounds: {
      //   type: "number"
      // },
      // unique: {
      //   type: "boolean"
      // },
      // ref: {
      //   type: "string"
      // },
      // localField: {
      //   type: "string"
      // },
      // foreignField: {
      //   type: "string"
      // },
      // enumType: {
      //   type: "string"
      // },
      // enumValues: {
      //   type: "string",
      //   many: true
      // },
      // managed: {
      //   type: "boolean"
      // },
      // fieldOptions: {
      //   type: "virtual",
      //   ref: "FieldOption",
      //   localField: "modelField",
      //   foreignField: "_id",
      //   many: true,
      // },
    },
    {
      historyTracking: false,
      indexes: [
        {
          fields: {
            model: 1,
            fieldName: 1
          },
          options: {
            unique: true,
          }
        }
      ]
    });
  const ModelOption = mercury.createModel("ModelOption",
    {
      model: {
        type: "relationship",
        ref: "Model",
      },
      // name: {
      //   type: "string"
      // },
      // managed: {
      //   type: "boolean"
      // },
      // keyName: {
      //   type: "string"
      // },
      // value: {
      //   type: "mixed",
      // },
      // type: {
      //   type: "string"
      // },
      // createdBy: {
      //   type: "relationship",
      //   ref: "User"
      // },
      // updatedBy: {
      //   type: "relationship",
      //   ref: "User"
      // },
    },
    {
      historyTracking: false
    });
  const FieldOption = mercury.createModel("FieldOption",
    {
      model: {
        type: "relationship",
        ref: "Model",
      },
      // modelField: {
      //   type: "relationship",
      //   ref: "ModelField",
      // },
      // fieldName: {
      //   type: "string"
      // },
      // keyName: {
      //   type: "string"
      // },
      // type: {
      //   type: "enum",
      //   enum: ["number", "string", "boolean"],
      //   enumType: "string",
      // },
      // value: {
      //   type: "mixed"
      // },
      // managed: {
      //   type: "boolean",
      // },
      // prefix: {
      //   type: "string",
      //   default: "CUSTOM"
      // }
    },
    {
      historyTracking: false
    });
}