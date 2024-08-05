export const Product:PModel={
    info: {
        name: 'Product',
        label: 'Product',
        description: 'Product model',
        managed: true,
        prefix: 'PRODUCT'
      },
      fields: {
       name:{
        type:"string"
       },
       description:{
        type:"string"
       },
       vendor:{
        type:"relationship",
        ref:"User"
       }
      
      },
      options: {
       historyTracking: false
      }
  }