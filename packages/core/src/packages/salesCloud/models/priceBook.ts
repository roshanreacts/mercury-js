import { Mercury } from '../../../mercury';

export const PriceBookSchema: any = (mercury: Mercury) => {
  mercury.createModel('PriceBook', {
    name: {
      type: 'string',
      required: true,
    },
    isActive: {
      type: 'boolean',
      default: false,
    },
    isStandard: {
      type: 'boolean',
      default: false,
    },
    description: {
      type: 'string',
    },
  });
};
