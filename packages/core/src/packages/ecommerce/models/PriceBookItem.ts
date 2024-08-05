export const PriceBookItem:PModel={
    info: {
        name: 'PriceBookItem',
        label: 'PriceBookItem',
        description: 'PriceBookItem model',
        managed: true,
        prefix: 'PriceBookItem'
      },
      fields: {
      productItem : {
        type : "relationship",
        ref : "ProductItem"
      },
      price : {
        type : "float"
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