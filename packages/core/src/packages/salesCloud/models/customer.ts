import { Mercury } from '../../../mercury';

export const CustomerSchema: any = (mercury: Mercury) => {
  mercury.createModel('Customer', {
    name: {
      type: 'string',
      required: true,
    },
    total: {
      type: 'number',
      required: true,
    },
    customer: {
      type: 'string',
      required: true,
    },
    status: {
      type: 'enum',
      enumType: 'string',
      enum: ['active', 'inactive'],
      required: true,
    },
  });
};
