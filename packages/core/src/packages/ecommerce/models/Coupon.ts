export const Coupon:PModel={
    info: {
        name: 'Coupon',
        label: 'Coupon',
        description: 'Coupon model',
        managed: true,
        prefix: 'COUPON'
      },
      fields: {
       code : {
        type : "string"
       },
       discount : {
        type : "string"
       },
       expiryDate : {
        type : "date"
       }
      
      },
      options: {
       historyTracking: false
      }
}