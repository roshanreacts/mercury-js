---
sidebar_position: 4
title: Models
---

## Mercury Models: Defining Your Data Structure

In Mercury, models act as the blueprints for your data. They define the shape and structure of your data, and they translate directly into Mongoose schemas and GraphQL types.

### `mercury.createModel`

This is the core function for creating a model. It takes three arguments:

1.  **`modelName`**: A string representing the name of your model (e.g., 'User', 'Product').
2.  **`schema`**: An object where the keys are the field names, and the values are objects defining the field types and options.
3.  **`options`**: An object for additional model-level options (e.g., timestamps, collection name).

### Field Types

Mercury supports a variety of field types to accommodate different data needs:

- **`string`**: For text data.

```typescript
title: { type: 'string', required: true },
description: { type: 'string' }
```

- **`number`**: For numerical data.

```typescript
price: { type: 'number' },
quantity: { type: 'number', default: 0 }
```

- **`boolean`**: For true/false values.

```typescript
isActive: { type: 'boolean', default: true }
```

- **`date`**: For storing dates and times.

```typescript
createdAt: { type: 'date' },
dueDate: { type: 'date' }
```

- **`relationship`**: To establish connections between models.

```typescript
author: { type: 'relationship', ref: 'User' }, // Many-to-one
comments: { type: 'relationship', ref: 'Comment', many: true } // One-to-many
```

- **`enum`**: To restrict a field's values to a predefined set.

```typescript
status: {
  type: 'enum',
  values: ['pending', 'in-progress', 'completed']
}
```

- **`array`**: To store a list of values of a single type.

```typescript
tags: { type: 'array', of: 'string' }
```

- **`object`**: To store nested data structures

```typescript
address: {
  type: 'object',
  of: {
    street: { type: 'string' },
    city: { type: 'string' },
    zipcode: { type: 'string' }
  }
}
```

- **`virtual`**: To define computed fields that are not stored in the database.

```typescript
fullName: {
  type: 'virtual',
  ref: 'User',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
  get: (user) => `${user.firstName} ${user.lastName}`
}
```

- **`mixed`**: Used when the type of data is not known beforehand or can vary

```typescript
metadata: {
  type: 'mixed';
}
```

### Field Options

You can further customize fields with these options:

- **`required`**: Makes the field mandatory.
- **`unique`**: Ensures that each value for this field is unique across all documents in the collection
- **`default`**: Sets a default value if none is provided.
- **`index`**: Creates an index on the field for faster queries
- **`select`**: Controls whether the field is included in query results by default
- **`autopopulate`**: Automatically populates the referenced document when querying the parent document.
- **`get`**: A function to compute the value of a virtual field

### Model Options

- **`timestamps`**: Automatically adds `createdAt` and `updatedAt` fields.
- **`collection`**: Specifies a custom collection name in the database

## Best Practices

- **Clear Naming:** Use descriptive names for models and fields.
- **Relationships:** Leverage relationships to model connections between data entities.
- **Enums:** Use enums for fields with a limited set of possible values
- **Virtual Fields:** Define virtual fields for computed or derived data
- **Indexes:** Strategically add indexes to improve query performance on frequently accessed fields.
- **Data Validation:** Consider adding custom validation logic using Mongoose validators or Mercury hooks

## Example

```typescript
import mercury from '@mercury-js/core';

export const BlogPost = mercury.createModel(
  'BlogPost',
  {
    title: { type: 'string', required: true },
    content: { type: 'string' },
    status: { type: 'enum', values: ['draft', 'published'], default: 'draft' },
    author: { type: 'relationship', ref: 'User', autopopulate: true },
    tags: { type: 'array', of: 'string' },
    publishedAt: { type: 'date', index: true },
    views: { type: 'number', default: 0 },
  },
  {
    timestamps: true,
  }
);
```

By understanding and utilizing Mercury's models and field types effectively, you'll be well-equipped to build robust and scalable APIs for your applications!

Let me know if you'd like a deeper dive into a specific aspect or feature!
