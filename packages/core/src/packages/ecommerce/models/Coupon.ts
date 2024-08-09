export const Coupon: PModel = {
  info: {
    name: 'Coupon',
    label: 'Coupon',
    description: 'Coupon model',
    managed: true,
    prefix: 'COUPON'
  },
  fields: {
    code: {
      type: "string"
    },
    discountType: {
      type: "enum",
      enum: ["PERCENTAGE", "FIXED_AMOUNT"],
      enumType: 'string',
    },
    discountValue: {
      type: "number"
    },
    maxDiscountPrice: {
      type: "number"
    },
    minOrderPrice: {
      type: "number"
    },
    expiryDate: {
      type: "date"
    }
  },
  options: {
    historyTracking: false
  }
}