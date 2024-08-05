export const Catalog:PModel={
    info: {
        name: 'Catalog',
        label: 'Catalog',
        description: 'Catalog model',
        managed: true,
        prefix: 'CATALOG'
      },
      fields: {
        productItem : {
          type : "relationship",
          ref : "ProductItem"
        },
        priceBook : {
          type : "relationship",
          ref : "PriceBook"
        }
      
      },
      options: {
       historyTracking: false
      }
}