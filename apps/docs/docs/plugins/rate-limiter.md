---
sidebar_position: 4
title: Rate Limiter
---

# Rate Limiter

The Rate Limiter feature helps manage API call restrictions, enhancing security by preventing abuse. If a user continuously hits an API, the rate limiter will impose restrictions, blocking the IP until a specified time.

## Features

- **API Call Restrictions**: Limits the number of requests a user can make within a defined time window.
- **Customizable Settings**: Configure the time window and maximum requests allowed.
- **Integration with GraphQL**: Seamlessly integrates with GraphQL using the `graphql-rate-limit` and `graphql-shield` packages.

## Usage

To add the Rate Limiter plugin to your project, use the following code:

```typescript
import rateLimiter from '@mercury-js/core/packages/rateLimiter';
mercury.package([rateLimiter()]);
```

### Configuration Options

You can customize the rate limiter by passing a permission map and options:

```typescript
rateLimiter(
  permissionMap: {},
  {
    window = '30s', // Time window for rate limiting
    max = 5, // Maximum requests allowed within the time window
    rateLimitRuleFunc = rateLimitRule, // Custom rate limit rule function
    ignoreDefault = false, // Whether to ignore default permissions
  }
);
```

### Default Permissions

By default, the rate limiter applies to all queries and mutations:

```typescript
const defaultPermissions = {
  Query: {
    '*': rateLimitRuleFunc({ window, max }),
  },
  Mutation: {
    '*': rateLimitRuleFunc({ window, max }),
  },
};
```

### Example

To implement the rate limiter, you can define a permission map and customize the settings as needed:

```typescript
const permissions = {
  Query: {
    getUser: rateLimitRuleFunc({ window: '10s', max: 2 }), // Custom limit for getUser query
  },
};

const rateLimiterMiddleware = rateLimiter(permissions);
```

This setup will restrict the `getUser` query to 2 requests every 10 seconds.

## Conclusion

The Rate Limiter plugin is essential for maintaining API security and ensuring fair usage among users. By implementing this feature, you can effectively manage request rates and protect your application from abuse.

