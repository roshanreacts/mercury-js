
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
    productItems:{
      type: "relationship",
      ref: "ProductItem",
      many: true
    },
    createdDate: {
      type: "date",
    }
  },
  options: {
    historyTracking: false
  }
}