import { Mercury } from '../../../mercury';

export const PriceBookEntrySchema: any = (mercury: Mercury) => {
  mercury.createModel('PriceBookEntry', {
    isActive: {
      type: 'boolean',
      default: false,
    },
    isStandard: {
      type: 'boolean',
      default: false,
    },
    listPrice: {
      type: 'number',
    },
    priceBookId: {
      type: 'relationship',
      ref: 'PriceBook',
      required: true,
    },
    productId: {
      type: 'relationship',
      ref: 'Product',
      required: true,
    },
    useStandardPrice: {
      type: 'boolean',
      default: false,
    },
    description: {
      type: 'string',
    },
  });
};
