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
    },
    variantGroups: {
      type: "relationship",
      ref: "VariantGroup",
      many: true,
    }
  },
  options: {
    historyTracking: false
  }
}