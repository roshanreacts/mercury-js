export const Product: PModel = {
  info: {
    name: 'Product',
    label: 'Product',
    description: 'Product model',
    managed: true,
    prefix: 'PRODUCT'
  },
  fields: {
    name: {
      type: "string"
    },
    description: {
      type: "string"
    },
    // this product belongs to how many market ->
    market: {
      type: "relationship",
      ref: "Market",
      many: true
    }
  },
  options: {
    historyTracking: false
  }
}