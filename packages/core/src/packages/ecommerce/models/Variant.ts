export const Variant: PModel = {
    info: {
      name: 'Variant',
      label: 'Variant',
      description: 'A specific variant belonging to a variant group',
      managed: true,
      prefix: 'VARIANT',
      key: "name"
    },
    fields: {
      name: {
        type: "string"
      },
      description: {
        type: "string"
      },
      variantGroup: {
        type: "relationship",
        ref: "VariantGroup"
      }
    },
    options: {
      historyTracking: false
    }
  }
  