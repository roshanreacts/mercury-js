import { Mercury } from '../../../mercury';

let mercury = new Mercury();

export const QuoteSchema: any = () => {
  mercury.createModel('Quote', {
    accountId: {
      //change it to ref account
      type: 'string',
      required: true,
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
      //change it to ref contact
      type: 'string',
      required: true,
    },
    contractId: {
      //change it to ref contractId
      type: 'string',
      required: true,
    },
    createdBy: {
      //change it to ref user
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
    },
    discount: {
      type: 'string',
    },
    email: {
      type: 'string',
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
    lastModifiedBy: {
      //change it to userId
      type: 'string',
    },
    opportunityId: {
      //change it to opportunity
      type: 'string',
    },
    ownerId: {
      //change it to User
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    name: {
      type: 'string',
      required: true,
    },
    quoteNumber: {
      //auto increment
      type: 'number',
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
    status: {
      type: 'enum',
      enumType: 'string',
      enum: ['stage1', 'stage2', 'stage3'],
    },
    subTotal: {
      type: 'number',
    },
    isSyncing: {
      type: 'enum',
      enumType: 'string',
      enum: ['stage1', 'stage2', 'stage3'],
    },
    tax: {
      type: 'number',
    },
    totalPrice: {
      type: 'number',
    },
  });
};
