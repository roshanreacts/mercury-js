import type { Mercury } from '../../mercury';
import { Redis } from '../redisCache';

type PlatformConfig = {
	prefix?: string;
};

declare module '../../mercury' {
	interface Mercury {
		platform: Platform;
		redis: Redis;
	}
}

export default (config?: PlatformConfig) => {
	return (mercury: Mercury) => {
		mercury.platform = new Platform(mercury, config);
		mercury.redis = new Redis();
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
	public async start() {
		// Get all the models from Model table and generate model schema and pass it to mercury.createModel
		// Store all the model schemas as Redis Cache with search capability (Make sure redis is enabled)
		const models: any = await this.mercury.db['Model'].mongoModel.find();
		const allModels: string[] = [];
		await models.map(async (model: any) => {
			allModels.push(model.name)
			const modelFields = await this.mercury.db['ModelField'].mongoModel.find();
			const modelOptions = await this.mercury.db['ModelOption'].mongoModel.find();
			const schema = this.composeSchema(modelFields);
			const options = this.composeOptions(modelOptions);
			this.mercury.createModel(model.name, schema, options);
			const redisObj = {
				name: model.name,
				fields: schema,
				options: options
			}
			// Store in redis - next step
			this.mercury.redis.set(`${model.name.toUpperCase()}`, JSON.stringify(redisObj));
		})
		this.mercury.redis.set("ALL_MODELS", JSON.stringify(allModels));
	}
	public initialize() {
		const Model = this.mercury.createModel("Model",
			{
				name: {
					type: "string",
					unique: true,
				},
				prefix: {
					type: "string"
				},
				managed: {
					type: "boolean",
				},
				createdBy: {
					type: "relationship",
					ref: "User"
				},
				updatedBy: {
					type: "relationship",
					ref: "User"
				},
			},
			{
				historyTracking: true
			});
		const ModelField = this.mercury.createModel("ModelField",
			{
				modelMetaData: {
					type: "relationship",
					ref: "ModelMetaData",
				},
				name: {
					type: "string"
				},
				createdBy: {
					type: "relationship",
					ref: "User"
				},
				updatedBy: {
					type: "relationship",
					ref: "User"
				},
				fieldName: {
					type: "string"
				},
				fieldType: {
					type: "string"
				},
				required: {
					type: "boolean",
				},
				default: {
					type: "string"
				},
				rounds: {
					type: "number"
				},
				unique: {
					type: "boolean"
				},
				ref: {
					type: "string"
				},
				localField: {
					type: "string"
				},
				foreignField: {
					type: "string"
				},
				enumType: {
					type: "string"
				},
				enumValues: {
					type: "string",
					many: true
				},
				managed: {
					type: "boolean"
				},
				fieldAttributes: {
					type: "virtual",
					ref: "FieldAttribute",
					localField: "model",
					foreignField: "_id",
					many: true,
				},
			},
			{
				historyTracking: true,
				indexes: [
					{
						fields: {
							modelMetaData: 1,
							fieldName: 1
						},
						options: {
							unique: true,
						}
					}
				]
			});
		const ModelOption = this.mercury.createModel("ModelOption",
			{
				modelMetaData: {
					type: "relationship",
					ref: "ModelMetaData",
				},
				name: {
					type: "string"
				},
				managed: {
					type: "boolean"
				},
				optionKey: {
					type: "string"
				},
				optionValue: {
					type: "mixed",
				},
				optionValueType: {
					type: "string"
				},
				createdBy: {
					type: "relationship",
					ref: "User"
				},
				updatedBy: {
					type: "relationship",
					ref: "User"
				},
			},
			{
				historyTracking: true
			});
		const FieldAttribute = this.mercury.createModel("FieldAttribute",
			{
				model: {
					type: "relationship",
					ref: "Model",
				},
				fieldOption: {
					type: "string"
				},
				fieldOptionType: {
					type: "string"
				},
				fieldOptionValue: {
					type: "string"
				},
				managed: {
					type: "boolean",
				},
			},
			{
				historyTracking: true
			});
		// Create ModelMetadata, Model, FieldAttributes, ModelOptions using mercury.createModel
		// Create index in Model (ModelMetada.Id, FieldName)
	}

	public composeSchema(modelFields: any): any {
		const schema: any = {};
		modelFields.map((model: any) => {
			const fieldName = model['fieldName'];
			const fieldObj: any = {};
			Object.keys(model).map((key: string) => {
				// Return for some fields
				fieldObj[key] = model[key];
			})
			schema[fieldName] = fieldObj;
		})
		return schema;
	}

	public composeOptions(modelOptions: any): any {
		const options: any = {};
		modelOptions.map((modelOption: any) => {
			options[modelOption.optionKey] = modelOption['optionValue']
		});
		return options;
	}

	public listModels() {
		//@ts-ignore
		return JSON.parse(this.mercury.redis.get("ALL_MODELS"));
	}

	public getModel(modelName: string) {
		//@ts-ignore
		return JSON.parse(this.mercury.redis.get(modelName));
	}
	// methods:
	// listModels (Redis cache)
	// getModel (Redis cache)
	// create/update/deleteModel (store the schema to DB and update the redis cache)

}
