export declare const createRateLimitRuleContext: (config: import("graphql-rate-limit").GraphQLRateLimitConfig) => (fieldConfig: import("graphql-rate-limit").GraphQLRateLimitDirectiveArgs) => import("graphql-shield").IRule;
export declare const rateLimitRule: Function;
export declare const rateLimiter: (permissionMap: {} | undefined, { window, max, rateLimitRuleFunc, ignoreDefault, }: {
    window?: string | undefined;
    max?: number | undefined;
    rateLimitRuleFunc?: Function | undefined;
    ignoreDefault?: boolean | undefined;
}) => IMiddlewareGenerator<TSource, TContext, TArgs>;
