import { PModel } from '../../../../types';
export const Order: PModel = {
  info: {
    name: 'Order',
    label: 'Order',
    description: 'Order model',
    managed: true,
    prefix: 'Order',
  },
  fields: {
    customer: {
      type: 'relationship',
      ref: 'Customer',
    },
    date: {
      type: 'date',
    },
    invoice: {
      type: 'relationship',
      ref: 'Invoice',
    },
  },
  options: {
    historyTracking: false,
  },
};

// need to create order items
