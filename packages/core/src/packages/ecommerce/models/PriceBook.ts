export const PriceBook: PModel = {
  info: {
    name: 'PriceBook',
    label: 'PriceBook',
    description: 'PriceBook model',
    managed: true,
    prefix: 'PRICE_BOOK',
    key: "name"
  },
  fields: {
    currency: {
      type: "string"
    },
    name: {
      type: "string"
    },
    priceBookItems: {
      type: "virtual",
      ref: "PriceBookItem",
      localField: "_id",
      foreignField: "priceBook",
      many: true,
    },
  },
  options: {
    historyTracking: false
  }

}