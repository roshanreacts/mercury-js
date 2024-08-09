export const Catalog: PModel = {
  info: {
    name: 'Catalog',
    label: 'Catalog',
    description: 'Catalog model',
    managed: true,
    prefix: 'CATALOG'
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