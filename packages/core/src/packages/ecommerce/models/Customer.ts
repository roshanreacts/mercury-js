export const Customer: PModel = {
  info: {
    name: 'Customer',
    label: 'Customer',
    description: 'Customer model',
    managed: true,
    prefix: 'CUSTOMER'
  },
  fields: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: "string",
      bcrypt: true
    },
    mobile: {
      type: "string"
    },
    profile: {
      type: "enum",
      enumType: "string",
      enum: ["Customer"]
    }
  },
  options: {
    historyTracking: false
  }
}