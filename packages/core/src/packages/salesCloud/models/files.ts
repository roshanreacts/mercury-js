import { Mercury } from '../../../mercury';

export const FileSchema: any = (mercury: Mercury) => {
  mercury.createModel('File', {
    filename: {
      type: 'string',
    },
    mimetype: {
      type: 'string',
    },
    path: {
      type: 'string',
    },
    extension: {
      type: 'string',
    },
    size: {
      type: 'string',
    },
    truncated: {
      type: 'string',
    },
    encoding: {
      type: 'string',
    },
    originalname: {
      type: 'string',
    },
    buffer: {
      type: 'string',
    },
  });
};
