export const Catalog: PModel = {
  info: {
    name: 'Catalog',
    label: 'Catalog',
    description: 'Catalog model',
    managed: true,
    prefix: 'CATALOG'
  },
  fields: {
    productItem: {
      type: "virtual",
      ref: "ProductItem",
      localField: "_id",
      foreignField: "catalog",
      many: true,
    },
    priceBook: {
      type: "relationship",
      ref: "PriceBook"
    }

  },
  options: {
    historyTracking: false
  }
}