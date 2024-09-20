---
sidebar_position: 2
title: Getting started with Next.js
---

This guide will walk you through setting up a Next.js application with `@mercury-js/core`, enabling you to quickly build a robust and secure API backend.

### Project Structure

Here's a recommended project structure:

```
your-project
├── pages
│   └── api
│       └── [your-endpoint].ts
└── models
    └── [your-model].ts
└── profiles
    └── [your-profile].ts
└── hooks
    └── [your-hook].ts
└── next.config.js
└── tsconfig.json
└── package.json
└── ...
```

- **pages**: Contains your Next.js routes, including your API endpoints.
- **models**: Houses your Mongoose models.
- **profiles**: Stores your access control profiles.
- **hooks**: Holds pre- and post-event hooks for your models.
- **next.config.js**: Configures your Next.js application.
- **tsconfig.json**: Typescript configuration file.
- **package.json**: Contains project dependencies and scripts.

### Setting up the Server

1. **Install Dependencies:**

   ```bash
   npm install @mercury-js/core @as-integrations/next @apollo/server @graphql-tools/schema graphql-middleware
   ```

2. **Create a Route (`pages/api/[your-endpoint].ts`):**

   ```typescript
   // pages/api/[your-endpoint].ts
   import { startServerAndCreateNextHandler } from '@as-integrations/next';
   import mercury from '@mercury-js/core';
   import { ApolloServer } from '@apollo/server';
   import { makeExecutableSchema } from '@graphql-tools/schema';
   import { applyMiddleware } from 'graphql-middleware';
   import './models'; // Import your models
   import './profiles'; // Import your profiles
   import './hooks'; // Import your hooks

   // Connect to your MongoDB database
   mercury.connect(process.env.DB_URL || 'mongodb://localhost:27017/mercury');

   // Add additional GraphQL typedefs and resolvers (optional)
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

   // Create the GraphQL schema
   const schema = applyMiddleware(
     makeExecutableSchema({
       typeDefs: mercury.typeDefs,
       resolvers: mercury.resolvers as unknown as IResolvers<
         any,
         GraphQLResolveInfo
       >[],
     })
   );

   // Initialize Apollo Server
   const server = new ApolloServer({
     schema,
   });

   // Create Next.js handler
   const handler = startServerAndCreateNextHandler(server, {
     context: async (req, res) => ({
       ...req,
       user: {
         id: '1', // Example user ID
         profile: 'Admin', // Example user profile
       },
     }),
   });

   // Export the handler for Next.js API routes
   export { mercuryInstance } from './[your-endpoint].ts';

   export async function GET(request: any) {
     return handler(request);
   }

   export async function POST(request: any) {
     return handler(request);
   }
   ```

### Creating Models

1. **Create Model Files (`models/[your-model].ts`):**

   ```typescript
   // models/User.model.ts
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
     },
     {}
   );

   // models/Account.model.ts
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
   ```

### Setting Up Profiles

1. **Create Profile Files (`profiles/[your-profile].ts`):**

   ```typescript
   // profiles/Admin.profile.ts
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

   // profiles/User.profile.ts
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
   ```

### Using Hooks

1. **Create Hook Files (`hooks/[your-hook].ts`):**

   ```typescript
   // hooks/User.hook.ts
   import { hook } from '@mercury-js/core';

   hook.before('CREATE_USER_RECORD', async function (this: any) {
     // Modify data before create
     this.data.name = 'Test 1';
   });

   hook.after('CREATE_USER_RECORD', async function (this: any, args: any) {
     console.log('AFTER CREATE hook', this);
   });
   ```

### Running the Server

1. **Start the Development Server:**

   ```bash
   npm run dev
   ```

Now, you have a Next.js application with a secure, efficient, and scalable API backend powered by `@mercury-js/core`. You can access your GraphQL API by making requests to your endpoint, for example:

```
http://localhost:3000/api/[your-endpoint]
```

This structure can be modified and expanded to suit your specific needs, allowing you to build complex applications with ease and security using `@mercury-js/core`.