import { Mercury } from '../../../mercury';

let mercury = new Mercury();

export const PriceBookSchema: any = () => {
  mercury.createModel('PriceBook', {
    isActive: {
      type: 'enum',
      enumType: 'string',
      enum: ['active', 'inactive'],
    },
    createdBy: {
      //change it to red User
      type: 'string',
    },
    isStandard: {
      type: 'enum',
      enumType: 'string',
      enum: ['active', 'inactive'],
    },
    description: {
      type: 'string',
    },
    lastModifiedBy: {
      //change it to userId
      type: 'string',
    },
    priceBookName: {
      //change it to userId
      type: 'string',
    },
  });
};
