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
    // why to have product items in the first place - we can have products simply ( items will be virutal to products ) - better flexibity
    productItem: {
      // belongs to catalog or not - can be mapped to many catalogs?! - discuss
      type: "relationship",
      ref: "ProductItem",
      many: true,
    },
    priceBook: {
      type: "relationship",
      ref: "PriceBook"
    },
    // catalog belongs to which market - !
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