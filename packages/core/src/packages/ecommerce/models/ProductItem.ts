export const ProductItem:PModel={
    info: {
        name: 'ProductItem',
        label: 'ProductItem',
        description: 'ProductItem model',
        managed: true,
        prefix: 'PRODUCTITEM'
      },
      fields: {
        product : {
          type : "relationship",
          ref : "Product"
        },
        description : {
          type : "string",
        },
        productAttributes : {
          type : "relationship",
          ref : "ProductAttribute"
        },
        media : {
          type : "string"//array
        }
      
      },
      options: {
       historyTracking: false
      }
}