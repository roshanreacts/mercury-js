export declare const rateLimiter: (
  permissionMap: object,
  options:
    | {
        window: string;
        max: number;
        rateLimitRule: any;
        ignoreDefault: boolean;
      }
    | undefined
) => any;
