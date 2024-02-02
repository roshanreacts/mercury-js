import type { Mercury } from '../../mercury';

export default (mercury: Mercury) => {
  const Model = mercury.createModel(
    'Model',
    {
      name: {
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
      },
      updatedBy: {
        type: 'relationship',
        ref: 'User',
      },
    },
    {
      historyTracking: false,
    }
  );
  const ModelField = mercury.createModel(
    'ModelField',
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
      createdBy: {
        type: 'relationship',
        ref: 'User',
      },
      updatedBy: {
        type: 'relationship',
        ref: 'User',
      },
      fieldName: {
        type: 'string',
        required: true,
      },
      type: {
        type: 'string',
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
  const ModelOption = mercury.createModel(
    'ModelOption',
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
      },
      updatedBy: {
        type: 'relationship',
        ref: 'User',
      },
    },
    {
      historyTracking: false,
    }
  );
  const FieldOption = mercury.createModel(
    'FieldOption',
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
      },
      prefix: {
        type: 'string',
        default: 'CUSTOM',
      },
    },
    {
      historyTracking: false,
    }
  );
};
