
export const Invoice: PModel = {
  info: {
    name: 'Invoice',
    label: 'Invoice',
    description: 'Invoice model',
    managed: true,
    prefix: 'INVOICE'
  },
  fields: {
    customer: {
      type: "relationship",
      ref: "Customer"
    },
    totalAmount: {
      type: "float"
    },
    shipingAddress: {
      type: "relationship",
      ref: "Address"
    },
    billingAddress: {
      type: "relationship",
      ref: "Address"
    },
    payment: {
      type: "relationship",
      ref: "Payment",
      unique: true
    },
    invoiceItems: {
      type: "virtual",
      ref: "InvoiceLine",
      localField: "_id",
      foreignField: "invoice",
      many: true
    },
    status: {
      type: "enum",
      enumType: "string",
      enum: ["Pending", "Paid"],
      default: "Pending"
    }
  },
  options: {
    historyTracking: false,
  }
}