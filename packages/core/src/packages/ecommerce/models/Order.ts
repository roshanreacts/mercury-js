export const Order: PModel = {
  info: {
    name: 'Order',
    label: 'Order',
    description: 'Order model',
    managed: true,
    prefix: 'Order'
  },
  fields: {
    customer: {
      type: "relationship",
      ref: "Customer"
    },
    date: {
      type: "date"
    },
    totalAmount: {
      type: "string"
    },
    status: {
      type: "enum",
      enumType: "string",
      enum: ["PENDING", "APPROVED"]
    }

  },
  options: {
    historyTracking: false
  }
}

// need to create order items