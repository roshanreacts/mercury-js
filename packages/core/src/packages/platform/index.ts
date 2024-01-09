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
		await Promise.all(models.map(async (model: any) => {
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
			await this.mercury.cache.set(`${model.name.toUpperCase()}`, JSON.stringify(redisObj));
		}));
		await this.mercury.cache.set("ALL_MODELS", JSON.stringify(allModels));
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
			let model: any = await _self.mercury.cache.get(this.name.toUpperCase());
			// Redis present
			if (model) {
				// Check in db if schema equal or not
				model = JSON.parse(model);
				const areFieldsSame = _.isEqual(this.fields, model.fields);
				const areOptionsSame = _.isEqual(this.options, model.options);
				// if(areFieldsSame && areOptionsSame) return;
				// Update the schema in redis and create field records or options records accordingly
				// console.log("before model data", await _self.mercury.db['Model'].mongoModel.findOne({ name: this.name }))
				const modelData = await _self.mercury.db['Model'].mongoModel.findOne({ name: this.name });
				console.log("after", modelData);
				if (!areFieldsSame) {
					const columns =["default", "rounds", "unique", "foreignField", "required", "ref", "localField", "enumType", "enumValues","managed"];// List of column names in field options
					// Need to find out the omitted fields and field options
					const diffFieldObj = _.omitBy(this.fields, (value, key) => {
						return _.isEqual(value, model.fields[key]);
					});
					// create or update
					Object.entries(diffFieldObj).forEach(async ([key, value]: any) => {
						const modelField = await _self.mercury.db['ModelField'].mongoModel.findOne({ model: modelData._id, fieldName: key });
						if (_.isEmpty(modelField)) {
							const newModelField = await _self.mercury.db['ModelField'].mongoModel.create({
								model: modelData._id,
								name: modelData.name,
								...value
							});
							// get field options
							const fieldOptions = _.omit(value, columns);
							// create field options
							Object.entries(fieldOptions).forEach(async ([fkey, fvalue]: any) => {
								await _self.mercury.db['FieldOption'].mongoModel.create({
									model: newModelField.model,
									modelField: newModelField._id,
									fieldName: key,
									keyName: fkey,
									value: fvalue
								})
							})
						} else {
							const updateData: any = {};
							Object.entries(value).forEach(async ([vkey, vvalue]: any) => {
								if (columns.includes(vkey) && modelField[vkey] !== vvalue) {
									updateData[vkey] = vvalue;
								} else {
									// field option create or update
									const fieldOption = await _self.mercury.db['FieldOption'].mongoModel.findOne({ modelField: modelField._id, fieldName: key, keyName: vkey });
									if (_.isEmpty(fieldOption)) {
										// create field option
										await _self.mercury.db['FieldOption'].mongoModel.create({
											model: modelField.model,
											modelField: modelField._id,
											fieldName: key,
											keyName: vkey,
											value: vvalue
										})
									} else {
										// update
										if (fieldOption.value == vvalue) return;
										await _self.mercury.db['FieldOption'].mongoModel.findOneAndUpdate({ _id: fieldOption._id }, { value: vvalue });
									}
								}
							})
							// Delete field obj internal value and delete field option
							const deleteFieldOptions = Object.keys(_.omit(model.fields[key], Object.keys(this.fields)));
							deleteFieldOptions.map(async (fieldOption: string) => {
								updateData[fieldOption] = undefined; // setting value undefined in model field data and deleting field option
								if (!columns.includes(fieldOption)) await _self.mercury.db['FieldOption'].mongoModel.deleteOne({ model: modelData._id, modelField: modelField._id, fieldName: key, keyName: fieldOption });
							})

							if (!_.isEmpty(updateData)) await _self.mercury.db['ModelField'].mongoModel.findOneAndUpdate({ _id: modelField._id }, { ...updateData });
						}
						// if not present need to create
						// existing model field update and field options create
					})
					//-----> delete
					const deleteFields = Object.keys(_.omit(model.fields, Object.keys(this.fields)));
					// delete field and field options associated to it
					deleteFields.map(async (deleteField: string) => {
						const modelField = await _self.mercury.db['ModelField'].mongoModel.findOne({ model: modelData._id, name: modelData.name, fieldName: deleteField });
						await _self.mercury.db['FieldOption'].mongoModel.deleteMany({ model: modelData._id, modelField: modelField._id });
						await _self.mercury.db['ModelField'].mongoModel.deleteOne({ _id: modelField._id });
					});
					console.log("diffObj", diffFieldObj);
				} else {
					// Done?
					const diffOptionObj = _.omitBy(this.options, (value, key) => {
						return _.isEqual(value, model.options[key]);
					});
					// Create and Update
					Object.entries(diffOptionObj).forEach(async ([key, value]: any) => {
						const modelOption = await _self.mercury.db['Model'].mongoModel.findOne({ model: modelData._id, name: modelData.name, keyName: key });
						if (_.isEmpty(modelOption)) {
							await _self.mercury.db['ModelOption'].mongoModel.create({
								model: modelData._id,
								name: modelData.name,
								keyName: key,
								value: value,
								type: typeof value
							});
						} else {
							if (modelOption.value == value) return;
							await _self.mercury.db['ModelOption'].mongoModel.findOneAndUpdate({ id: modelOption._id }, { keyName: key, value: value, type: typeof value });
						}
					})
					// Delete - omitted
					const deleteKeys = Object.keys(_.omit(model.options, Object.keys(this.options)));
					deleteKeys.map(async (deleteKey: string) => {
						await _self.mercury.db['ModelOption'].mongoModel.deleteOne({ model: modelData._id, keyName: deleteKey });
					})
				}
			} else {
				// not in redis need to create
				const skipFields = ["default", "rounds", "unique", "foreignField", "required", "ref", "localField", "enumType", "enumValues","managed"];// add all the fields from modelField
				const model = await this.mercury.db['Model'].create({
					name: this.name,
					prefix: this.data.prefix,
					managed: this.data.managed,
					createdBy: this.ctx.id,
					updatedBy: this.ctx.id,
				}, this.ctx, { skipHooks: true });
				Object.entries(this.fields).forEach(async ([key, value]: any) => {
					let modelFieldObj: any = {
						model: model._id,
						name: model.name,
						fieldName: key,
						type: value.type,
						createdBy: this.ctx.id,
						updatedBy: this.ctx.id,
						default: value.default,
						rounds: value.rounds,
						unique: value.unique,
						ref: value.ref,
						localField: value.localField,
						foreignField: value.foreignField,
						enumType: value.enumType,
						enumValues: value.enumValues,
						managed: value.managed
					};
					const modelField = await this.mercury.db['ModelField'].create(modelFieldObj, this.ctx, { skipHooks: true });
					Object.entries(value).map(async ([fkey, fvalue]: any) => {
						// skip field options
						if (skipFields.includes(fkey)) return;
						await this.mercury.db['FieldOption'].create({
							model: model._id,
							modelField: modelField._id,
							fieldName: key,
							keyName: fkey,
							type: typeof fvalue,
							value: fvalue,
							managed: modelField.managed,
							prefix: modelField.prefix
						}, this.ctx, { skipHooks: true });
					})
				});
				Object.entries(this.options).forEach(async ([key, value]: any) => {
					let modelOptionsObj: any = {
						model: model._id,
						name: model.name,
						managed: model.managed,
						keyName: key,
						value: value.value,
						type: value.type
					}
					await this.mercury.db['ModelOption'].create(modelOptionsObj, this.ctx, { skipHooks: true });
				})
				const redisObj = {
					name: this.data.name,
					fields: this.fields,
					options: this.options
				}
				await this.mercury.cache.set(`${model.name.toUpperCase()}`, JSON.stringify(redisObj));
			}
		});
		console.log("Test")

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
