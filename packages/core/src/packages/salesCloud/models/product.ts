import { Mercury } from '../../../mercury';

let mercury = new Mercury();

export const ProductSchema: any = () => {
  mercury.createModel('Product', {
    isActive: {
      type: 'enum',
      enumType: 'string',
      enum: ['active', 'inactive'],
      required: true,
    },
    createdBy: {
      //change it to red User
      type: 'string',
    },
    displayUrl: {
      type: 'string',
    },
    externalId: {
      type: 'string',
    },
    lastModifiedBy: {
      //change it to userId
      type: 'string',
    },
    productCode: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
    },
    productFamily: {
      type: 'enum',
      enumType: 'string',
      enum: ['active', 'inactive'],
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    sku: {
      type: 'string',
    },
    quantityUnitOfMeasure: {
      type: 'enum',
      enumType: 'string',
      enum: ['active', 'inactive'],
      required: true,
    },
  });
};
