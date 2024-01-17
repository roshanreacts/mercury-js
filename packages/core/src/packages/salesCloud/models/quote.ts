import { Mercury } from '../../../mercury';

export const QuoteSchema: any = (mercury: Mercury) => {
  mercury.createModel('Quote', {
    accountId: {
      type: 'relationship',
      ref: 'Account',
    },
    additionalAddress: {
      type: 'string',
    },
    additionalName: {
      type: 'string',
    },
    billingAddress: {
      type: 'string',
    },
    billingName: {
      type: 'string',
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
      type: 'number',
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
      type: 'string',
    },
    subTotal: {
      type: 'number',
    },
    tax: {
      type: 'string',
    },
    totalPrice: {
      type: 'number',
    },
  });
};
