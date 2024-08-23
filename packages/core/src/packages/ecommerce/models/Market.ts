export const Market: PModel = {
  info: {
    name: 'Market',
    label: 'Market',
    description: 'Market model',
    managed: true,
    prefix: 'MARKET',
    key: "name"
  },
  fields: {
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    location: {
      type: "string",
    },
    isActive: {
      type: "boolean",
    },
    currency: {
      type: "string"
    },
    collections: {
      type: "relationship",
      ref: "Collection",
      many: true
    },
  },
  options: {
    historyTracking: false
  }
}