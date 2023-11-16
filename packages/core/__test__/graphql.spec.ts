import { Mgraphql } from '../src/graphql';
import { Model } from '../src/models';

describe('Generate graphql Schema', () => {
  it('should generate the query for the fields', () => {
    const query = Mgraphql.genQuery('User', {
      name: {
        type: 'string',
      },
      age: {
        type: 'number',
        required: true,
      },
      active: {
        type: 'boolean',
      },
      profile: {
        type: 'enum',
        enum: ['admin', 'user'],
        enumType: 'string',
      },
      account: {
        type: 'relationship',
        ref: 'Account',
      },
    });
    expect(query).toEqual(
      `type User {
    name: String
    age: Int!
    active: Boolean
    profile: UserProfileEnumType
    account: Account
    createdOn: DateTime
    updatedOn: DateTime
}

enum UserProfileEnumType {
    admin
    user
}`
    );
  });

  it('should generate the input for the fields', () => {
    const query = Mgraphql.genInput('User', {
      name: {
        type: 'string',
      },
      age: {
        type: 'number',
        required: true,
      },
      active: {
        type: 'boolean',
      },
      profile: {
        type: 'enum',
        enum: ['admin', 'user'],
        enumType: 'string',
      },
      account: {
        type: 'relationship',
        ref: 'Account',
        many: true,
      },
    });
    expect(query).toEqual(
      `input UserInput {
    name: String
    age: Int!
    active: Boolean
    profile: UserProfileEnumType
    account: [String]
}`
    );
  });

  it('should generate model schema', () => {
    const query = Mgraphql.genModel(
      'User',
      {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
          required: true,
        },
        password: {
          type: 'string',
          bcrypt: true,
          rounds: 10,
        },
        active: {
          type: 'boolean',
        },
        profile: {
          type: 'enum',
          enum: ['admin', 'user'],
          enumType: 'string',
        },
        account: {
          type: 'relationship',
          ref: 'Account',
          many: true,
        },
        test: {
          type: 'string',
          ignoreGraphQL: true,
        },
      },
      { historyTracking: false }
    );
    expect(query).toEqual(
      `
type Query {
    getUser(where: whereUserInput!): User
    listUsers(where: whereUserInput, sort: sortUserInput = {},offset: Int! = 0, limit: Int! = 10): [User]
}

type Mutation {
    createUser(input: UserInput!): User
    createUsers(input: [UserInput!]!): [User]
    updateUser(input: updateUserInput!): User
    updateUsers(input: [updateUserInput!]!): [User]
    deleteUser(id: ID!): User
    deleteUsers(ids: [ID!]): User
}

type User {
    name: String
    age: Int!
    active: Boolean
    profile: UserProfileEnumType
    account: [Account]
    createdOn: DateTime
    updatedOn: DateTime
}

enum UserProfileEnumType {
    admin
    user
}

input UserInput {
    name: String
    age: Int!
    password: String
    active: Boolean
    profile: UserProfileEnumType
    account: [String]
}

input updateUserInput {
    id: String
    name: String
    age: Int!
    password: String
    active: Boolean
    profile: UserProfileEnumType
    account: [String]
}

input whereUserInput {
    name: whereString
    age: whereInt
    active: Boolean
    profile: UserProfileEnumType
    account: whereID
    createdOn: whereDateTime
    updatedOn: whereDateTime
    AND: [whereUserInput!]
    OR: [whereUserInput!]
}

input sortUserInput {
    name: sort
    age: sort
    active: sort
    profile: sort
    createdOn: sort
    updatedOn: sort
}
    `
    );
  });
  it('should generate model resolvers', () => {
    const userModel = new Model({
      name: 'User',
      fields: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
          required: true,
        },
        active: {
          type: 'boolean',
        },
        profile: {
          type: 'enum',
          enum: ['admin', 'user'],
          enumType: 'string',
        },
        account: {
          type: 'relationship',
          ref: 'Account',
          many: true,
        },
      },
      options: { historyTracking: false },
    });
    const resolvers = Mgraphql.genResolvers('User', userModel);
    expect(Object.keys(resolvers.Query).length).toBe(2);
    expect(Object.keys(resolvers.Mutation).length).toBe(6);
  });
});

describe('resolvers crud test cases', () => {
  it('should create a record', () => {
    const userModel = new Model({
      name: 'UserOne',
      fields: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
          required: true,
        },
        active: {
          type: 'boolean',
        },
        profile: {
          type: 'enum',
          enum: ['admin', 'user'],
          enumType: 'string',
        },
        account: {
          type: 'relationship',
          ref: 'Account',
          many: true,
        },
      },
      options: { historyTracking: false },
    });
    const resolvers = Mgraphql.genResolvers('User', userModel);
    expect(Object.keys(resolvers.Query).length).toBe(2);
    expect(Object.keys(resolvers.Mutation).length).toBe(6);
  });
});
