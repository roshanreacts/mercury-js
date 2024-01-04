import type { Mercury } from '../../mercury';

type PlatformConfig = {
    prefix?: string;
};

declare module '../../mercury' {
    interface Mercury {
        platform: Platform;
    }
}

export default (config?: PlatformConfig) => {
    return (mercury: Mercury) => {
        mercury.platform = new Platform(mercury, config);
    };
};

export class Platform {
    protected mercury: Mercury;
    public config: PlatformConfig;
    constructor(mercury: Mercury, config?: PlatformConfig) {
        this.mercury = mercury;
        this.config = config || {};
    }
}
