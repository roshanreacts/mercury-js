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
    category: {
      type: "relationship",
      ref: "Category",
      // many: true -> research
    }
    // productItems: {
    //   type: "virtual",
    //   ref: "ProductItem",
    //   foreignField: 'product',
    //   localField: '_id'
    // }
  },
  options: {
    historyTracking: false
  }
}