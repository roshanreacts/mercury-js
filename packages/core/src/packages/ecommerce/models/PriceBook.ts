export const PriceBook: PModel = {
  info: {
    name: 'PriceBook',
    label: 'PriceBook',
    description: 'PriceBook model',
    managed: true,
    prefix: 'PRICEBOOK'
  },
  fields: {
    currency: {
      type: "float"
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