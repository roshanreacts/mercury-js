import { PModel } from '../../../../types';
export const ProductAttribute: PModel = {
  info: {
    name: 'ProductAttribute',
    label: 'ProductAttribute',
    description: 'ProductAttribute model',
    managed: true,
    prefix: 'PRODUCT_ATTRIBUTE',
  },
  fields: {
    colour: {
      type: 'string',
    },
    size: {
      type: 'string',
    },
    weight: {
      type: 'number',
    },
  },
  options: {
    historyTracking: false,
  },
};
