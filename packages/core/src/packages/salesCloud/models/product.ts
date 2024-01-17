import { Mercury } from '../../../mercury';

export const ProductSchema: any = (mercury: Mercury) => {
  mercury.createModel('Product', {
    name: {
      type: 'string',
      required: true,
    },
    isActive: {
      type: 'boolean',
      default: false,
    },
    code: {
      type: 'string',
    },
    family: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    images: {
      type: 'relationship',
      ref: 'File',
      many: true,
    },
  });
};
