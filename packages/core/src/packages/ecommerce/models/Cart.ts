
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
    cartItems:{
      type: "relationship",
      ref: "CartItem",
      many: true
    },
  },
  options: {
    historyTracking: false
  }
}