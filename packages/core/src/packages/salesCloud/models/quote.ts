import { Mercury } from '../../../mercury';

export const QuoteSchema: any = (mercury: Mercury) => {
  mercury.createModel('Quote', {
    accountId: {
      type: 'relationship',
      ref: 'Account',
    },
    additionalAddress: {
      type: 'number',
    },
    additionalName: {
      type: 'number',
    },
    billingAddress: {
      type: 'number',
    },
    billingName: {
      type: 'number',
    },
    contactId: {
      type: 'relationship',
      ref: 'Contact',
    },
    description: {
      type: 'string',
    },
    discount: {
      type: 'string',
    },
    email: {
      type: 'string',
      required: true,
    },
    expirationDate: {
      type: 'string',
    },
    fax: {
      type: 'string',
    },
    grandTotal: {
      type: 'string',
    },
    opportunityId: {
      type: 'relationship',
      ref: 'Opportunity',
    },
    owner: {
      type: 'relationship',
      ref: 'User',
    },
    phone: {
      type: 'string',
    },
    name: {
      type: 'string',
      required: true,
    },
    quoteToAddress: {
      type: 'string',
    },
    quoteToName: {
      type: 'string',
    },
    shippingAddress: {
      type: 'string',
    },
    shippingName: {
      type: 'string',
    },
    shippingHandling: {
      type: 'number',
    },
    subTotal: {
      type: 'number',
    },
    tax: {
      type: 'number',
    },
    totalPrice: {
      type: 'number',
    },
  });
};
