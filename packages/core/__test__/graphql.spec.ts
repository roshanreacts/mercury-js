import { Mgraphql } from '../src/graphql';

describe('Generate graphql Schema', () => {
  it('should generate the query for the fields', () => {
    const query = Mgraphql.genQuery('User', {
      name: {
        type: 'string',
      },
      age: {
        type: 'number',
        isRequired: true,
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
        isRequired: true,
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
          isRequired: true,
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
      { historyTracking: false }
    );
    expect(query).toEqual(
      `
type Query {
    getUser(id: ID!): User
    listUser(limit: Int, offset: Int, where: whereUserInput): [User]
}

type Mutation {
    createUser(input: UserInput!): User
    createUsers(input: [UserInput!]!): [User]
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): User
}

type User {
    name: String
    age: Int!
    active: Boolean
    profile: UserProfileEnumType
    account: [Account]
}

enum UserProfileEnumType {
    admin
    user
}

input UserInput {
    name: String
    age: Int!
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
}
    `
    );
  });
});
