export const VariantGroup: PModel = {
    info: {
      name: 'VariantGroup',
      label: 'Variant Group',
      description: 'Group of variants such as color, size, etc.',
      managed: true,
      prefix: 'VARIANT_GROUP',
      key: "name"
    },
    fields: {
      name: {
        type: "string"
      },
      description: {
        type: "string"
      },
      variants: {
        type: "virtual",
        ref: "Variant",
        localField: 'variantGroup',
        foreignField: '_id',
        many: true
      },
      displayOrder: {
        type: "number",
      },
      variantSlicing: {
        type: "boolean"
      }
    },
    options: {
      historyTracking: false
    }
  }
  