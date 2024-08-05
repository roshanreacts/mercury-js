export const User:PModel={
    info: {
        name: 'User',
        label: 'User',
        description: 'User model',
        managed: true,
        prefix: 'USER'
      },
      fields: {
        username: {
           type: 'string'
        },
        email: {
          type:'string'
        },
        password:{
          type:"string"
        },
        mobile:{
          type:"string"
        },
        role:{
          type:"enum",
          enumType:"string",
          enum:["ADMIN","USER"]
        },
        status:{
          type:"enum",
          enumType:"string",
          enum:["ACTIVE","IN_ACTIVE"]
        }
      
      },
      options: {
       historyTracking: false
      }
  }