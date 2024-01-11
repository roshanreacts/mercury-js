import { Mercury } from '../../../mercury';

export const FileSchema: any = (mercury: Mercury) => {
  mercury.createModel('File', {
    title: {
      type: 'string',
    },
    isDeleted: {
      type: 'boolean',
      default: false,
    },
    fileType: {
      type: 'string',
    },
    size: {
      type: 'string',
    },
    visibility: {
      type: 'enum',
      enumType: 'string',
      enum: ['AllUser'],
    },
  });
};
