import { Mercury } from '../../../mercury';

export const OpportunityProductSchema: any = (mercury: Mercury) => {
  mercury.createModel('OpportunityProduct', {
    date: {
      type: 'date',
    },
    discount: {
      type: 'number',
    },
    opportunityId: {
      type: 'relationship',
      ref: 'Opportunity',
    },
    listPrice: {
      type: 'number',
    },
    productId: {
      type: 'relationship',
      ref: 'Product',
    },
    quantity: {
      type: 'number',
    },
    salesPrice: {
      type: 'number',
    },
    subTotal: {
      type: 'number',
    },
    total: {
      type: 'number',
    },
    description: {
      type: 'string',
    },
  });
};
