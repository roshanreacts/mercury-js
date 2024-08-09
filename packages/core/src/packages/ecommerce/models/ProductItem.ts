export const ProductItem: PModel = {
  info: {
    name: 'ProductItem',
    label: 'Product Item',
    description: 'ProductItem model',
    managed: true,
    prefix: 'PRODUCTITEM'
  },
  fields: {
    product: {
      type: "relationship",
      ref: "Product"
    },
    description: {
      type: "string",
    },
    productAttributes: {
      type: "virtual",
      ref: "ProductAttribute",
      foreignField: 'productItem',
      localField: '_id'
    },
    images: {
      type: "relationship",
      ref: 'File',
      many: true
    },
    catalog: { // is it really required - 1. what catalog it belongs to
      type: "relationship",
      ref: "Catalog"
    },
    vendor: {
      type: "relationship",
      ref: "User"
    },
    // check these are required or not
    couponApplicable: {
      type: "boolean",
    },
    coupons: {
      type: "relationship",
      ref: 'Coupon',
      many: true
    }
  },
  options: {
    historyTracking: false
  }
}