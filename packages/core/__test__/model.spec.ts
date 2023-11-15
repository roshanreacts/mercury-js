import { Model } from '../src/models';
import access from '../src/access';
import hook from '../src/hooks';
import * as db from './db';
import mongoose from 'mongoose';

describe('Model create', () => {
  let modelInstance: Model;
  let productModel: Model = new Model({
    name: 'Product',
    fields: {
      name: {
        type: 'string',
      },
    },
    options: {
      historyTracking: false,
    },
  });

  const productDetailModel: TModel = {
    name: 'ProductDetail',
    fields: {
      name: {
        type: 'string',
      },
    },
    options: {
      historyTracking: false,
    },
  };
  const productDetailModelInstance = new Model(productDetailModel);

  beforeAll(async () => {
    const name = 'Admin';
    const rules = [
      {
        modelName: 'Product',
        access: {
          create: false,
          read: false,
          update: false,
          delete: false,
        },
        fields: {
          name: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
        },
      },
      {
        modelName: 'PriceBook',
        access: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        fields: {
          name: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
        },
      },
      {
        modelName: 'ProductDetail',
        access: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        fields: {
          name: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
        },
      },
    ];
    access.createProfile(name, rules);
    await db.setUp();
  });
  // afterEach(async () => {
  //   await db.dropCollections();
  // });

  afterAll(async () => {
    await db.dropDatabase();
  });
  it('should throw an error as access is blocked for create', async () => {
    const userCtx = {
      id: '1',
      profile: 'Admin',
    };
    try {
      const create = await productModel.create({ name: 'test' }, userCtx);
      expect(modelInstance).toBeDefined();
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        'You does not have access to perform this action on this record/ field.'
      );
    }
  });

  it('should create the record and trigger both before and after hooks for the model', async () => {
    const model: TModel = {
      name: 'PriceBook',
      fields: {
        name: {
          type: 'string',
        },
      },
      options: {
        historyTracking: false,
      },
    };
    const userCtx = {
      id: '1',
      profile: 'Admin',
    };

    modelInstance = new Model(model);
    try {
      hook.before(
        `CREATE_${model.name.toUpperCase()}_RECORD`,
        function (this: any) {
          if (this.record.name === 'rename') {
            this.record.name = 'test 2';
          }
        }
      );
      hook.after(
        `CREATE_${model.name.toUpperCase()}_RECORD`,
        function (this: any) {
          expect(this.record.name).toBe('test 2');
        }
      );
      await modelInstance.create({ name: 'rename' }, userCtx);
      expect(modelInstance).toBeDefined();
    } catch (error: any) {
      expect(error).toBeUndefined();
    }
  });

  it('should be stop the create if before hook throws error', async () => {
    const userCtx = {
      id: '1',
      profile: 'Admin',
    };

    try {
      hook.before(
        `CREATE_${productDetailModel.name.toUpperCase()}_RECORD`,
        function (this: any) {
          if (this.record.name === 'test 2') {
            throw new Error('test');
          }
        }
      );
      hook.after(
        `CREATE_${productDetailModel.name.toUpperCase()}_RECORD`,
        function (this: any) {
          expect(this.record.name).toBe('test 2');
        }
      );
      const create = await productDetailModelInstance.create(
        { name: 'test 2' },
        userCtx
      );
      expect(create).toBeDefined();
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('test');
    }
  });

  it('should update the record and trigger both before and after hooks for the model', async () => {
    try {
      hook.before(`UPDATE_PRICEBOOK_RECORD`, function (this: any) {
        if (this.fields.name === 'test 3') {
          this.fields.name = 'Hook Updated Me';
        }
      });
      hook.after(`UPDATE_PRICEBOOK_RECORD`, function (this: any) {
        expect(this.record.name).toBe('Hook Updated Me');
      });
      const userCtx = {
        id: '1',
        profile: 'Admin',
      };

      const createRecord = await modelInstance.create(
        { name: 'test 1' },
        userCtx
      );
      const getRecord = await modelInstance.get({ name: 'test 1' }, userCtx);
      const update = await modelInstance.update(
        getRecord.id,
        { name: 'test 3' },
        userCtx
      );
      expect(createRecord).toBeDefined();
      expect(getRecord).toBeDefined();
      expect(update).toBeDefined();
      expect(update.name).toBe('Hook Updated Me');
    } catch (error: any) {
      expect(error).toBeUndefined();
    }
  });

  it('should be stop me from reading a record the record is not found', async () => {
    try {
      const userCtx = {
        id: '1',
        profile: 'Admin',
      };
      await modelInstance.get({ name: 'not found' }, userCtx);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Record not found');
    }
  });

  it('should be stop me from update a record the record is not found', async () => {
    try {
      const userCtx = {
        id: '1',
        profile: 'Admin',
      };
      var newId = new mongoose.Types.ObjectId();
      const get = await modelInstance.update(
        newId.toString(),
        { name: 'not found' },
        userCtx
      );
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Record not found');
    }
  });

  it('should be stop me from reading a record the access is blocked', async () => {
    try {
      const userCtx = {
        id: '1',
        profile: 'Admin',
      };
      const get = await productModel.get({ name: 'test 1' }, userCtx);
      expect(get).toBeDefined();
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        'You does not have access to perform this action on this record/ field.'
      );
    }
  });

  it('should be stop me from update a record the access is blocked', async () => {
    try {
      const userCtx = {
        id: '1',
        profile: 'Admin',
      };
      const update = await productModel.update(
        'testId',
        { name: 'test 1' },
        userCtx
      );
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        'You does not have access to perform this action on this record/ field.'
      );
    }
  });

  it('should be stop me from delete a record the access is blocked', async () => {
    try {
      const userCtx = {
        id: '1',
        profile: 'Admin',
      };
      await productModel.delete('testId', userCtx);
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe(
        'You does not have access to perform this action on this record/ field.'
      );
    }
  });

  it('should return list pagination with pagination', async () => {
    const userCtx = {
      id: '1',
      profile: 'Admin',
    };
    // test 2 will be rejected by before create hook in above testx
    await Promise.all(
      ['test 1', 'test 3', 'test 4'].map(
        async (name) =>
          await productDetailModelInstance.create({ name }, userCtx)
      )
    );
    const getAllProducts = await productDetailModelInstance.paginate(
      {},
      {},
      userCtx
    );
    expect(getAllProducts.docs.length).toBe(3);
  });
});
