
export const Category: PModel = {
  info: {
    name: 'Category',
    label: 'Category',
    description: 'Category model',
    managed: true,
    prefix: 'CATEGORY',
  },
  fields: {
    name: {
      type: "string",
    },
    description: {
      type: "string",
    },
    parent: {
      type: "relationship",
      ref: "Category"
    },
    // Check if it works or not
    // subCategories: {
    //   type: "virtual",
    //   ref: "Category",
    //   foreignField: 'parent',
    //   localField: '_id'
    // },
    products: {
      type: "virtual",
      ref: "Product",
      foreignField: 'category',
      localField: '_id'
    }
  },
  options: {
    historyTracking: false
  }
}