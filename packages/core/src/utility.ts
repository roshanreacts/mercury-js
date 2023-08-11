export const historySchema = (name: string): TFields => {
  return {
    recordId: {
      type: 'relationship',
      ref: name,
    },
    operationType: {
      type: 'enum',
      enum: ['UPDATE', 'DELETE'],
      enumType: 'string',
      isRequired: true,
    },
    instanceId: {
      type: 'string',
      isRequired: true,
    },
    dataType: {
      type: 'string',
      isRequired: true,
    },
    fieldName: {
      type: 'string',
      isRequired: true,
    },
    newValue: {
      type: 'string',
      isRequired: true,
    },
    oldValue: {
      type: 'string',
      isRequired: true,
    },
  };
};
