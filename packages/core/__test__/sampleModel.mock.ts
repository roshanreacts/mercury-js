export const TodoSchema = {
  fields: {
    name: {
      type: 'string',
      isRequired: true,
    },
    isCompleted: {
      type: 'boolean',
      default: false,
    },
    owner: {
      type: 'relationship',
      ref: 'User',
      many: false,
    },
  },
  resolvers: {
    Query: {
      getTodo: (root: any, args: any, schema: any) => {
        return { id: 'NS2343', name: 'Roshan', isCompleted: false }
      },
    },
  },
}

export const TodoGql = `
type Query {
  allTodos: [Todo]
  getTodo: Todo
}

type Mutation {
  createTodo: Todo
  createTodos: [Todo]
  updateTodo: Todo
  updateTodos: [Todo]
  deleteTodo: Todo
  deleteTodos: [Todo]
}

type Todo {
  id: ID!
  name: String!
  isCompleted: Boolean
}
`

export const UserSchema = {
  fields: {
    firstName: {
      type: 'string',
      isRequired: true,
    },
    lastName: {
      type: 'string',
    },
    todosCount: {
      type: 'number',
      default: 0,
    },
    password: {
      type: 'string',
      isRequired: true,
      ignoreGraphql: {
        read: true,
      },
    },
    isAdmin: {
      type: 'boolean',
      default: false,
      graphqlType: 'Currency',
    },
    role: {
      type: 'enum',
      enumType: 'string',
      enum: ['NEW', 'STATUS'],
      default: 'NEW',
    },
    todos: {
      type: 'relationship',
      ref: 'Todo',
      many: true,
    },
    todosVirtual: {
      type: 'virtual',
      ref: 'Todo',
      localField: 'id',
      foreignField: 'owner',
      many: true,
    },
  },
  resolvers: {
    Query: {
      login: (root: any, args: any, schema: any) => {
        return { id: 'NS2343', name: 'Roshan', isCompleted: false }
      },
    },
  },
  typeDefs: `
  type Query {
    login(username: String, password: String): User
  }
  `,
}

export const baseTypedefs = `
input whereID {
  is: ID
  isNot: ID
  in: [ID!]
  notIn: [ID!]
}

input whereString {
  is: String
  isNot: String
  contains: String
  notContains: String
  startsWith: String
  notStartWith: String
  endsWith: String
  notEndsWith: String
  isIn: [String]
  notIn: [String]
}

input whereInt {
  is: Int
  isNot: Int
  lt: Int
  lte: Int
  gt: Int
  gte: Int
  in: [Int]
  notIn: [Int]
}`

export const UserGql = `
type Query {
  allUsers(where: whereUserInput, offset: Int! = 0, limit: Int! = 10): UserPagination
  getUser(where: whereUserInput): User
}

input whereUserInput {
  id: whereID
  firstName: whereString
  lastName: whereString
  todosCount: whereInt
  isAdmin: Boolean
  role: UserRoleEnumType
  todos: whereID

  AND: [whereUserInput]
  OR: [whereUserInput]
}

type UserPagination {
  docs: [User]
  totalDocs: Int
  offset: Int
  limit: Int
}

type Mutation {
  createUser(data: createUserInput!): User
  createUsers(data: [createUserInput!]!): [User]
  updateUser(id: ID!, data: updateUserSchema!): User
  updateUsers(data: [updateUserInput!]!): [User]
  deleteUser(id: ID!): Boolean
  deleteUsers(ids: [ID!]): Boolean
}

type User {
  id: ID!
  firstName: String
  lastName: String
  todosCount: Int
  isAdmin: Currency
  role: UserRoleEnumType
  todos: [Todo]
  todosVirtual: [Todo]
}

input createUserInput {
  firstName: String!
  lastName: String
  todosCount: Int
  password: String!
  isAdmin: Currency
  role: UserRoleEnumType
  todos: [String]
  todosVirtual: [String]
}
input updateUserSchema {
  firstName: String
  lastName: String
  todosCount: Int
  password: String
  isAdmin: Currency
  role: UserRoleEnumType
  todos: [String]
  todosVirtual: [String]
}

input updateUserInput {
  id: ID!
  data: updateUserSchema!
}

  type Query {
    login(username: String, password: String): User
  }
  

enum UserRoleEnumType {
  NEW
  STATUS
}

`
