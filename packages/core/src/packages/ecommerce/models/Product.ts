export const Product: PModel = {
  info: {
    name: 'Product',
    label: 'Product',
    description: 'Product model',
    managed: true,
    prefix: 'PRODUCT',
    key: "name"
  },
  fields: {
    name: {
      type: "string"
    },
    description: {
      type: "string"
    },
    category: {
      type: "relationship",
      ref: "Category",
      // many: true -> research
    },
    isBundledProduct: {
      type: "boolean"
    },
    bundledProducts: {
      type: "relationship",
      ref: "Product",
      many: true
    }
  },
  options: {
    historyTracking: false
  }
}