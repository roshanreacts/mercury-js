export const Order:PModel={
    info: {
        name: 'Order',
        label: 'Order',
        description: 'Order model',
        managed: true,
        prefix: 'Order'
      },
      fields: {
       user : {
        type : "relationship",
        ref : "User"
       },
       date : {
        type : "date"
       },
       totalAmount : {
        type : "string"
       },
      //  status : {
      //   type : "enum",
      //   enumType : "string",
      //   enum:["ADMIN","USER"]
      //  }
      
      },
      options: {
       historyTracking: false
      }
}