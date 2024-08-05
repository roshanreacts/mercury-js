export const ProductAttribute:PModel={
    info: {
        name: 'ProductAttribute',
        label: 'ProductAttribute',
        description: 'ProductAttribute model',
        managed: true,
        prefix: 'PRODUCTATTRIBUTE'
      },
      fields: {
      colour:{
        type:"string"
      },
      size:{
        type:"string"
      },
      weight:{
        type : "float"
      }
      },
      options: {
       historyTracking: false
      },
}