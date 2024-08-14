
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
      ref: "Customer"
    },
    totalAmount: {
      type: "string",
    },
    cartToken:{
      type: "string",
      unique: true
    },
    cartItems:{
      type: "virtual",
      ref: "CartItem",
      localField: "_id",
      foreignField: "cart",
      many: true
    },
  },
  options: {
    historyTracking: false
  }
}