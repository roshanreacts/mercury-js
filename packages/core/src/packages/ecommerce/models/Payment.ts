export const Payment:PModel={
    info: {
        name: 'Payment',
        label: 'Payment',
        description: 'Payment model',
        managed: true,
        prefix: 'Payment'
      },
      fields: {
       order : {
        type : "relationship",
        ref : "Order"
       },
       method : {
        type : "enum",
        enumType : "string",
        enum : ["OFFLINE","ONLINE"]
       },
       amount : {
        type : "string"
       },
       date : {
        type : "date"
       }
      
      },
      options: {
       historyTracking: false
      }
}