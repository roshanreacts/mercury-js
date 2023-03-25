# Welcome to Mercury JS

Mercury is a JavaScript framework for building Backend as a service (BaaS) applications. It is built on top of [Express](http://expressjs.com/) and GraphQL.

## Getting Started

To get started, you can use the [Javascript]`
mercury.connect("mongodb://localhost:27017/mercury");
mercury.createList("User", {
fields: {
name: { type: Text },
email: { type: Text },
password: { type: Password },
},
});
)`

Mercury will generate GraphQL based CRUD API for User Model.
