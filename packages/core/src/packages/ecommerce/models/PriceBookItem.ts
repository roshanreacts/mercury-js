export const PriceBookItem: PModel = {
  info: {
    name: 'PriceBookItem',
    label: 'PriceBookItem',
    description: 'PriceBookItem model',
    managed: true,
    prefix: 'PRICE_BOOK_ITEM'
  },
  // coupons handle it from here
  fields: {
    product: {
      type: "relationship",
      ref: "Product"
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
    },
    offerPrice: {
      type: "number"
    },
    variants: {
      type: "relationship",
      ref: "Variant",
      many: true
    }
  },
  options: {
    historyTracking: false,
    indexes: [
      {
        fields: {
          product: 1,
          variant: 1,
          priceBook: 1
        },
        options: {
          unique: true,
        },
      },
    ]
  }
}

// Varying prices for a single product