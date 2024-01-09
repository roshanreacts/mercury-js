import { Mercury } from '../../../mercury';

let mercury = new Mercury();

export const AccountSchema: any = () => {
  mercury.createModel('Account', {
    name: {
      type: 'string',
      required: true,
      unique: true,
    },
    ownerId: {
      //change it to userId
      type: 'string',
    },
    site: {
      type: 'string',
    },
    annualRevenue: {
      type: 'number',
    },
    billingAddress: {
      type: 'string',
    },
    jigsaw: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    tier: {
      type: 'string',
    },
    industry: {
      type: 'string',
    },
    lastModifiedBy: {
      //change it to userId
      type: 'string',
    },
    ownership: {
      type: 'enum',
      enumType: 'string',
      enum: ['PRIVATE', 'PUBLIC', 'SUBSIDAIRY', 'OTHER'],
    },
    parentId: {
      //change it to userId
      type: 'string',
      //   required: true,
    },
    phone: {
      type: 'string',
    },
    rating: {
      type: 'enum',
      enumType: 'string',
      enum: ['HOT', 'WARM', 'COLD'],
    },
    shippingAddress: {
      type: 'string',
    },
    sic: {
      type: 'string',
    },
    sicDesc: {
      type: 'string',
    },
    tickerSymbol: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    website: {
      type: 'string',
    },
  });
};
