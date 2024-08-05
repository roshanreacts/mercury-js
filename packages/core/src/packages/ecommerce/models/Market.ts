export const Market:PModel={
    info: {
        name: 'Market',
        label: 'Market',
        description: 'Market model',
        managed: true,
        prefix: 'MARKET'
      },
      fields: {
       name : {
        type : "string",
       },
       currency : {
        type : "float"
      },
      catalog : {
        type : "relationship",
        ref : "Catalog"
      },
      user : {
        type : "relationship",
        ref : "User"
      }
      },
      options: {
       historyTracking: false
      }
}