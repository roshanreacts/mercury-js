export const Collection: PModel = {
  info: {
    name: 'Collection',
    label: 'Collection',
    description: 'Collection model',
    managed: true,
    prefix: 'COLLECTION',
    key: "name",
  },
  fields: {
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    productItems: {
      type: "relationship",
      ref: "ProductItem",
      many: true,
    },
    priceBook: {
      type: "relationship",
      ref: "PriceBook"
    },
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