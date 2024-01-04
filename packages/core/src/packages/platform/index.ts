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
        // initialize here
    };
};

export class Platform {
    protected mercury: Mercury;
    public config: PlatformConfig;
    constructor(mercury: Mercury, config?: PlatformConfig) {
        this.mercury = mercury;
        this.config = config || {};
    }
    public start() {
        // Get all the models from Model table and generate model schema and pass it to mercury.createModel
        // Store all the model schemas as Redis Cache with search capability (Make sure redis is enabled)
        // 
    }
    public initialise() {
        // Create ModelMetadata, Model, FieldAttributes, ModelOptions using mercury.createModel
        // Create index in Model (ModelMetada.Id, FieldName)
    }
    // methods:
    // listModels (Redis cache)
    // getModel (Redis cache)
    // create/update/deleteModel (store the schema to DB and update the redis cache)

}
