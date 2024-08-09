export const PriceBookItem: PModel = {
  info: {
    name: 'PriceBookItem',
    label: 'PriceBookItem',
    description: 'PriceBookItem model',
    managed: true,
    prefix: 'PriceBookItem'
  },
  fields: {
    productItem: {
      type: "relationship",
      ref: "ProductItem"
    },
    price: {
      type: "number"
    },
    quantity: {
      type: "number"
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

// Varying prices for a single product