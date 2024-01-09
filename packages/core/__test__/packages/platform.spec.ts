import mercury from "../../src/mercury";
import platform from "../../src/packages/platform";
import * as db from '../db';
import access from '../../src/access';
import redisCache from '../../src/packages/redisCache';

mercury.package([redisCache(), platform()]);

describe("platform", () => {
	// const platformApp = platform();
	// platformApp(mercury);
	it("should be able to create a platform instance", () => {
		// const platformApp = platform();
		// platformApp(mercury);
		// expect(mercury.platform).toBeDefined();
	});
	it('should set the key and value to redis', async () => {
    const key: string = 'mercury';
    const value: string = 'graphql';
    await mercury.cache.set(key, value);
    const getMercury = await mercury.cache.get(key);
		console.log("REDIS_PING", getMercury)
    expect(getMercury).toBe(value);
  });
	it("should be intialize and start the platform", async () => {
		console.log("Second")
		mercury.platform.initialize();
		const newModel = await mercury.db['Model'].create({
			name: "Test1",
			prefix: "test1",
			managed: false
		}, { id: "1", profile: "Admin" });
		const newModelField = await mercury.db['ModelField'].create({
			model: newModel._id,
			fieldName: "field_1",
			type: "string",
			required: true,
			default: "test",
			managed: false
		}, { id: "1", profile: "Admin" });
		const modelOption = await mercury.db['ModelOption'].create({
			model: newModel._id,
			keyName: "historyTracking",
			value: "true",
			type: "boolean"
		}, { id: "1", profile: "Admin" })
		const fieldOption = await mercury.db['FieldOption'].create({
			model: newModel._id,
			modelField: newModelField._id,
			keyName:  "dummy",
			type: "boolean",
			value: "true"
		}, { id: "1", profile: "Admin"})
	  await mercury.platform.start();
		console.log("REDIS_ALL_MODELS",await mercury.cache.get("ALL_MODELS"));
		console.log("REDIS_SINGLE_MODEL",await mercury.cache.get("TEST1"));
		console.log("LIST_MODELS",await mercury.platform.listModels());
		console.log("GET_MODEL",await mercury.platform.getModel("TEST1"));
		// console.log("new Model", newModel);
	})

	beforeAll(async () => {
		console.log("First")
		const name = 'Admin';
    const rules = [
      {
        modelName: 'Model',
        access: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      },
      {
        modelName: 'ModelField',
        access: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      },
      {
        modelName: 'ModelOption',
        access: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      },
			{
        modelName: 'FieldOption',
        access: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      },
    ];
    access.createProfile(name, rules);
		await db.setUp();
	})
	afterAll(async () => {
		console.log("final")
		// await db.dropDatabase();
	});
});
