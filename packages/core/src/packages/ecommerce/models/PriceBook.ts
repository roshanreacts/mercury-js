export const PriceBook:PModel={
    info: {
        name: 'PriceBook',
        label: 'PriceBook',
        description: 'PriceBook model',
        managed: true,
        prefix: 'PRICEBOOK'
      },
      fields: {
       currency : {
        type : "float"
       },
       name : {
        type : "string"
       },
       priceBookItem : {
        type : "relationship",
        ref : "PriceBookItem"
       },
      
      },
      options: {
       historyTracking: false
      }
      
}