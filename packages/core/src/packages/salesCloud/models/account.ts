import { Mercury } from '../../../mercury';

export const AccountSchema: any = (mercury: Mercury) => {
  mercury.createModel('Account', {
    name: {
      type: 'string',
      required: true,
    },
    parentId: {
      type: 'relationship',
      ref: 'Account',
    },
    accNumber: {
      type: 'number',
    },
    owner: {
      type: 'relationship',
      ref: 'User',
      required: true,
    },
    site: {
      type: 'string',
    },
    type: {
      type: 'enum',
      enumType: 'string',
      enum: [
        'PROSPECT',
        'CUSTOMER_DIRECT',
        'CUSTOMER_CHANNEL',
        'INSTALLATION_PARTNER',
        'TECHNOLOGY_PARTNER',
        'OTHER',
      ],
    },
    industry: {
      type: 'string',
    },
    annualRevenue: {
      type: 'number',
    },
    fax: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    rating: {
      type: 'enum',
      enumType: 'string',
      enum: ['HOT', 'WARM', 'COLD'],
    },
    tickerSymbol: {
      type: 'string',
    },
    website: {
      type: 'string',
    },
    ownership: {
      type: 'enum',
      enumType: 'string',
      enum: ['PRIVATE', 'PUBLIC', 'SUBSIDAIRY', 'OTHER'],
    },
    sicCode: {
      type: 'string',
    },
    billingAddress: {
      type: 'string',
    },
    billingCity: {
      type: 'string',
    },
    billingState: {
      type: 'string',
    },
    billingCountry: {
      type: 'string',
    },
    billingZipCode: {
      type: 'string',
    },
    shippingAddress: {
      type: 'string',
    },
    shippingCity: {
      type: 'string',
    },
    shippingState: {
      type: 'string',
    },
    shippingCountry: {
      type: 'string',
    },
    shippingZipCode: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    lead: {
      type: 'relationship',
      ref: 'Lead',
    },
  });
};
