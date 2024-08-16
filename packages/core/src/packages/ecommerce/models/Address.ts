
export const Address: PModel = {
  info: {
    name: 'Address',
    label: 'Address',
    description: 'Address model',
    managed: true,
    prefix: 'ADDRESS',
    key: "name"
  },
  fields: {
    customer: {
      type: "relationship",
      ref: "Customer"
    },
    // type: {
    //   type: "enum",
    //   enumType: "string",
    //   enum: ["SHIPPING", "BILLING"]
    // },
    name: {
      type: "string",
    },
    street: {
      type: "string",
    },
    city: {
      type: "string",
    },
    state: {
      type: "string",
    },
    country: {
      type: "string",
    },
    zipCode: {
      type: "string",
    },
    mobile: {
      type: "string",
    },
    landmark: {
      type: "string",
    },
    addressLine1: {
      type: "string",
    },
    addressLine2: {
      type: "string",
    },
    isDefault: {
      type: "boolean",
    },
  },
  options: {
    historyTracking: false
  }
}