---
sidebar_position: 6
title: Mercury
---
# Mercury Documentation

This guide provides a step-by-step overview of how to use the **Mercury** for managing GraphQL schemas and MongoDB models, along with examples of methods such as `connect`, `disconnect`, `addGraphqlSchema`, `createModel`, and `deleteModel`.

## 1. Connecting to MongoDB

The `connect` method establishes a connection to the MongoDB database.

### Usage:
```typescript
mercury.connect(DB_URL);
```
### Example
```typescript
mercury.connect("mongodb://localhost:27017/mydatabase");
```
This connects the Mercury instance to a MongoDB database hosted locally.

## 2. Disconnecting from MongoDB

The `disconnect` method is used to close the MongoDB connection.
### Usage:
```typescript
await mercury.disconnect();
```
### Example
```typescript
await mercury.disconnect();
```
This gracefully closes the connection to MongoDB and shuts down the Mercury ORM instance.

## 3. Adding GraphQL Schema

The `addGraphqlSchema` method allows you to add custom type definitions and resolvers to the existing GraphQL schema.
### Usage:
```typescript
mercury.addGraphqlSchema(typeDefs, resolvers);
```
### Example
```typescript
const typeDefs = `
  type Query {
    getBook(id: ID!): Book
  }

  type Book {
    id: ID!
    title: String
    author: String
  }
`;

const resolvers = {
  Query: {
    getBook: async (_, { id }) => {
      return await mercury.db.Book.findById(id);
    },
  },
};

mercury.addGraphqlSchema(typeDefs, resolvers);
```
This adds a new GraphQL schema for querying a `Book` object.

## 4. Creating a Model

The `createModel` method allows you to define a MongoDB model in Mercury ORM.

### Usage:
```typescript
mercury.createModel(name, fields, options?);
```

Parameters:
- ***`name`***: Name of the model (e.g., "`User`")
- ***[`fields`](./fields.md)***: Fields of the model, including types and options
- ***[`options`](./options.md)***: Optional settings for the model

### Types

```typescript
type TModel = {
  fields: [`TFields`];
  name: string;
  options?: TOptions;
};
```
### Note:
For a detailed explanation of the `TFields` and `TField` types, please refer to the [Field Types and Structure](./fields.md#field-types-and-structure) section in the Fields documentation.

### Example
```typescript
const fields = {
  name: { type: 'string', required: true },
  email: { type: 'string', required: true },
  age: { type: 'number', required: false },
  role: { type: 'enum', enum: ['USER', 'ADMIN'], default: 'USER' },
  createdAt: { type: 'date', default: Date.now },
};

mercury.createModel('User', fields);
```

This creates a `User` model with fields `name`, `email`, `age`, `role`, and `createdAt`.

Note that any additional Mongoose-supported properties can be included in the field definition and will behave as they do in Mongoose.

## 5. Deleting a Model

The `deleteModel` method removes a model from Mercury ORM and the associated GraphQL schema.

### Usage:
```typescript
mercury.deleteModel(modelName);
```
### Example
```typescript
mercury.deleteModel('User');
```
This deletes the `User` model from the Mercury instance, removing the corresponding GraphQL type definitions and resolvers.




