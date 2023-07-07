import { createRateLimitRule } from 'graphql-rate-limit';
import { shield } from 'graphql-shield';
import { merge } from 'lodash';

// Creating a rate limit rule function using graphql-rate-limit package
const rateLimitRuleFunc = createRateLimitRule({
  identifyContext: (ctx) => ctx?.request?.ipAddress || ctx?.id,
});

// Defining a rate limiter function that takes in a permission map and options object
export const rateLimiter = (
  permissionMap: {} = {},
  options:
    | {
        window: string;
        max: number;
        rateLimitRule: any;
        ignoreDefault: boolean;
      }
    | undefined = {
    window: '1s',
    max: 5,
    rateLimitRule: rateLimitRuleFunc,
    ignoreDefault: false,
  }
) => {
  // Extracting options from the options object
  const { window, max, rateLimitRule } = options;

  // Defining default permissions for Query and Mutation
  const defaultPermissions = {
    Query: {
      '*': rateLimitRule({ window, max }),
    },
    Mutation: {
      '*': rateLimitRule({ window, max }),
    },
  };

  // Merging default permissions with the permission map passed in
  const permissionMapOutput = merge(defaultPermissions, permissionMap);

  // Returning a shield middleware with the final permission map
  return shield(permissionMapOutput);
};
