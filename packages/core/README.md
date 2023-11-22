# @mercury-js/core

## Getting started

```bash
npm install @mercury-js/core
```

## Usage

```typescript
// route.ts for nextJS
// for express you can directly use apollo server setup
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import mercury from '@mercury-js/core';
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import './models';
import './profiles';
import './hooks';

mercury.connect(process.env.DB_URL || 'mongodb://localhost:27017/mercury');

mercury.addGraphqlSchema(
  `
  type Query {
    hello: String
  }
`,
  {
    Query: {
      hello: (root: any, args: any, ctx: any, resolveInfo: any) => {
        return 'Hello World!';
      },
    },
  }
);

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs: mercury.typeDefs,
    resolvers: mercury.resolvers as unknown as IResolvers<
      any,
      GraphQLResolveInfo
    >[],
  })
);

const server = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => ({
    ...req,
    user: {
      id: '1',
      profile: 'Admin',
    },
  }),
});

export const mercuryInstance = mercury;

export async function GET(request: any) {
  return handler(request);
}

export async function POST(request: any) {
  return handler(request);
}
```

## Models

```typescript
// User.model.ts
import mercury from '@mercury-js/core';

export const User = mercury.createModel(
  'User',
  {
    name: {
      type: 'string',
    },
    account: {
      type: 'relationship',
      ref: 'Account',
    },
    test: {
      type: 'string',
    },
    testv: {
      type: 'virtual',
      ref: 'Account',
      localField: 'account',
      foreignField: '_id',
      justOne: true,
    },
  },
  {}
);

// Account.model.ts
import mercury from '@mercury-js/core';
export const AccountSchema = {
  name: {
    type: 'string',
  },
  user: {
    type: 'relationship',
    ref: 'User',
  },
};

export const Account = mercury.createModel('Account', AccountSchema, {});

// index.ts

export { User } from './User.model';
export { Account } from './Account.model';
```

## Profiles

```typescript
// User.profile.ts
import mercury from '@mercury-js/core';

const rules = [
  {
    modelName: 'User',
    access: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
  },
  {
    modelName: 'Account',
    access: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
    fieldLevelAccess: true,
    fields: {
      name: {
        read: false,
      },
    },
  },
];

export const UserProfile = mercury.createProfile('User', rules);

// Admin.profile.ts
import mercury from '@mercury-js/core';

const rules = [
  {
    modelName: 'User',
    access: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
  {
    modelName: 'Account',
    access: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
];

export const AdminProfile = mercury.createProfile('Admin', rules);

// index.ts
export { AdminProfile } from './Admin.profile';
export { UserProfile } from './User.profile';
```

## Hooks

```typescript
// User.hook.ts
import { hook } from '@mercury-js/core';

hook.before('CREATE_USER_RECORD', async function (this: any) {
  //modify data before create
  this.data.name = 'Test 1';
  this.data.test = 'Test 3';
});

hook.after('CREATE_USER_RECORD', async function (this: any, args: any) {
  console.log('Here');
  console.log('AFTER CREATE hook', this);
});

hook.before('UPDATE_USER_RECORD', function (this: any) {
  console.log('BEFORE UPDATE hook', this);
});

hook.after('UPDATE_USER_RECORD', function (this: any) {
  console.log('Here');

  console.log('AFTER UPDATE hook', this);
});

hook.before('DELETE_USER_RECORD', function (this: any) {
  console.log('BEFORE DELETE hook', this);
});

hook.after('DELETE_USER_RECORD', function (this: any) {
  console.log('Here');

  console.log('AFTER DELETE hook', this);
});

// index.ts

export { default as UserHook } from './User.hook';
```

## License

[MIT](LICENSE).
