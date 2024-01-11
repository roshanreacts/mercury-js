import type { Mercury } from '../../mercury';
// import { Redis } from '../redisCache';
import _ from "lodash";

type PlatformConfig = {
	prefix?: string;
};

declare module '../../mercury' {
	interface Mercury {
		platform: Platform;
		// redis: Redis;
	}
}

export default (config?: PlatformConfig) => {
	return (mercury: Mercury) => {
		mercury.platform = new Platform(mercury, config);
		// mercury.redis = new Redis();
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
		this.subscribeHooks();
		const models: any = await this.mercury.db['Model'].mongoModel.find({});
		console.log("ALL MODELS", models);
		const allModels: string[] = [];
		models.map(async (model: any) => {
			allModels.push(model.name)
			const modelFields = await this.mercury.db['ModelField'].mongoModel.find({ model: model._id });
			const fieldOptions = await this.mercury.db['FieldOption'].mongoModel.find({ model: model._id });
			const modelOptions = await this.mercury.db['ModelOption'].mongoModel.find({ model: model._id });
			const schema = this.composeSchema(modelFields, fieldOptions);
			const options = this.composeOptions(modelOptions);
			this.mercury.createModel(model.name, schema, options);
			const redisObj = {
				name: model.name,
				fields: schema,
				options: options
			}
			// await this.mercury.cache.set(`${model.name.toUpperCase()}`, JSON.stringify(redisObj));
		});
		// await this.mercury.cache.set("ALL_MODELS", JSON.stringify(allModels));
		console.log("getting all models", await this.mercury.cache.get("ALL_MODELS"));
	}
	public initialize() {
		console.log('Initializing')
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
				model: {
					type: "relationship",
					ref: "Model",
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
				type: {
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
				fieldOptions: {
					type: "virtual",
					ref: "FieldOption",
					localField: "modelField",
					foreignField: "_id",
					many: true,
				},
			},
			{
				historyTracking: true,
				indexes: [
					{
						fields: {
							model: 1,
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
				model: {
					type: "relationship",
					ref: "Model",
				},
				name: {
					type: "string"
				},
				managed: {
					type: "boolean"
				},
				keyName: {
					type: "string"
				},
				value: {
					type: "mixed",
				},
				type: {
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
		const FieldOption = this.mercury.createModel("FieldOption",
			{
				model: {
					type: "relationship",
					ref: "Model",
				},
				modelField: {
					type: "relationship",
					ref: "ModelField",
				},
				fieldName: {
					type: "string"
				},
				keyName: {
					type: "string"
				},
				type: {
					type: "enum",
					enum: ["number", "string", "boolean"],
					enumType: "string",
				},
				value: {
					type: "mixed"
				},
				managed: {
					type: "boolean",
				},
				prefix: {
					type: "string",
					default: "CUSTOM"
				}
			},
			{
				historyTracking: true
			});
		// Create ModelMetadata, Model, FieldAttributes, ModelOptions using mercury.createModel
		// Create index in Model (ModelMetada.Id, FieldName)
	}

	public composeSchema(modelFields: any, fieldOptions?: any): any {
		const skipFields = ["id", "_id", "fieldName", "model", "name", "createdBy", "updatedBy", "managed", "fieldOptions", "createdOn", "updatedOn", "__v"];
		const schema: any = {};
		modelFields.map((modelField: any) => {
			const fieldName = modelField['fieldName'];
			const fieldObj: any = {};
			Object.keys(modelField['_doc']).map((key: string) => {
				// Return for some fields
				if (skipFields.includes(key)) return;
				fieldObj[key] = modelField[key];
			})
			const fieldOption = fieldOptions.filter((fieldOption: any) => fieldOption.modelField.equals(modelField._id));
			fieldOption.map((option: any) => {
				let type = option.type;
				let value = option.value;
				fieldObj[option.keyName] = (type == "number" ? Number(value) : (type == "string" ? String(value) : Boolean(value)));
			}),
				schema[fieldName] = fieldObj;
		})
		return schema;
	}

	public composeOptions(modelOptions: any): any {
		const options: any = {};
		modelOptions.map((modelOption: any) => {
			let type = modelOption.type;
			let value = modelOption.value;
			options[modelOption.keyName] = (type == "number" ? Number(value) : (type == "string" ? String(value) : (type == "boolean" ? Boolean(value) : JSON.parse(value))));
		});
		return options;
	}

	public listModels() {
		//@ts-ignore
		return this.mercury.cache.get("ALL_MODELS");
	}

	public getModel(modelName: string) {
		//@ts-ignore
		return this.mercury.cache.get(modelName);
	}

	private subscribeHooks() {
		// Model create and update hooks has to be triggered
		// Record update also has to be triggered -> here we will update in the db and redis.
		this.subscribeToModelHooks();
		this.subscribeToRecordHooks();
	}

	private async subscribeToModelHooks() {
		// Before the server starts and restart in middle
		// if already present in redis and schema is equal -> return
		// if redis absent try to fetch from db if present or not , if present pull it from there instead of creating 
		// present in redis and schema not equal , build new schema adn store it
		const _self = this;
		this.mercury.hook.before('CREATE_MODEL', async function (this: any) {
			console.log("redis obj", await _self.mercury.cache.get(this.name.toUpperCase()))
			// let model: any = await _self.mercury.cache.get(this.name.toUpperCase());
			// model = JSON.parse(model);
		});
		console.log("working")

	}

	private subscribeToRecordHooks() {
		// After the server is started these hooks will be executed
		this.mercury.hook.after('CREATE_MODELFIELD_RECORD', async function (this: any) {
			// create field options fi required
			if (this.options.skipHooks) return;
			this.syncModelFields(this);
		});
		this.mercury.hook.after('UPDATE_MODELFIELD_RECORD', async function (this: any) {
			// create field options fi required
			if (this.options.skipHooks) return;
			this.syncModelFields(this);
		})
		this.mercury.hook.before('DELETE_MODELFIELD_RECORD', async function (this: any) {
			// deletre field options for modelfields
			if (this.options.skipHooks) return;
			const redisObj = await this.mercury.cache.get(this.modelField.name);
			delete redisObj.fields[this.data.fieldName];
			const newRedisObj = {
				name: redisObj.name,
				fields: redisObj.fields,
				options: redisObj.options
			}
			await this.mercury.cache.set(`${redisObj.name.toUpperCase()}`, JSON.stringify(newRedisObj));
		})
		this.mercury.hook.after('CREATE_MODELOPTION_RECORD', async (data: any) => {
			if (data.options.skipHooks) return;
			this.syncModelOptions(data);
		})
		this.mercury.hook.after('UPDATE_MODELOPTION_RECORD', async (data: any) => {
			if (data.options.skipHooks) return;
			this.syncModelOptions(data);
		})
		this.mercury.hook.before('DELETE_MODELOPTION_RECORD', async (data: any) => {
			if (data.options.skipHooks) return;
			const redisObj: any = await this.mercury.cache.get(data.modelField.name);
			delete redisObj.options[data.data.fieldName];
			const newRedisObj = {
				name: redisObj.name,
				fields: redisObj.fields,
				options: redisObj.options
			}
			await this.mercury.cache.set(`${redisObj.name.toUpperCase()}`, JSON.stringify(newRedisObj));
		})
		this.mercury.hook.after('CREATE_FIELDOPTION_RECORD', async (data: any) => {
			if (data.options.skipHooks) return;
			this.syncFieldOptions(data);
		})

	}

	private allModels() {
		return this.mercury.list.map(model => model.name);
	}

	private async syncModelFields(this: any) {
		const redisObj = await this.mercury.cache.get(this.modelField.name);
		const fieldSchema = this.composeSchema([this.data]);
		redisObj.fields[this.data.fieldName] = fieldSchema;
		const newRedisObj = {
			name: redisObj.name,
			fields: redisObj.fields,
			options: redisObj.options
		}
		await this.mercury.cache.set(`${redisObj.name.toUpperCase()}`, JSON.stringify(newRedisObj));
	}

	private async syncModelOptions(data: any) {
		const redisObj: any = await this.mercury.cache.get(data.modelField.name);
		const options = this.composeOptions([data.data]);
		redisObj.options[data.data.key] = options;
		const newRedisObj = {
			name: redisObj.name,
			fields: redisObj.fields,
			options: redisObj.options
		}
		await this.mercury.cache.set(`${redisObj.name.toUpperCase()}`, JSON.stringify(newRedisObj));
	}

	private async syncFieldOptions(data: any) {

	}

	// methods:
	// listModels (Redis cache)
	// getModel (Redis cache)
	// create/update/deleteModel (store the schema to DB and update the redis cache)

}
