
export const Cart: PModel = {
  info: {
    name: 'Cart',
    label: 'Cart',
    description: 'Cart model',
    managed: true,
    prefix: 'CART'
  },
  fields: {
    customer: {
      type: "relationship",
      ref: "User"
    },
    totalAmount: {
      type: "string",
    },
    createdDate: {
      type: "date",
    }

  },

  options: {
    historyTracking: false
  }
}