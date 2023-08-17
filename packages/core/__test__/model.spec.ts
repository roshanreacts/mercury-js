import { Model } from '../src/models';
import access from '../src/access';
import hook from '../src/hooks';

describe('Model create', () => {
  beforeAll(() => {
    const name = 'Admin';
    const rules = [
      {
        modelName: 'Product',
        access: {
          create: false,
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
  });
  it('should throw an error as access is blocked for create', async () => {
    const model: TModel = {
      name: 'Product',
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
    const modelInstance = new Model(model);
    try {
      const create = await modelInstance.create({ name: 'test' }, userCtx);
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

    const modelInstance = new Model(model);
    try {
      hook.before(
        `CREATE_${model.name.toUpperCase()}_RECORD`,
        function (this: any) {
          this.record.name = 'test 2';
        }
      );
      hook.after(
        `CREATE_${model.name.toUpperCase()}_RECORD`,
        function (this: any) {
          expect(this.record.name).toBe('test 2');
        }
      );
      const create = await modelInstance.create({ name: 'test' }, userCtx);
      expect(modelInstance).toBeDefined();
    } catch (error: any) {
      expect(error).toBeUndefined();
    }
  });

  it('should be stop the create if before hook throws error', async () => {
    const model: TModel = {
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
    const userCtx = {
      id: '1',
      profile: 'Admin',
    };

    const modelInstance = new Model(model);
    try {
      hook.before(
        `CREATE_${model.name.toUpperCase()}_RECORD`,
        function (this: any) {
          this.record.name = 'test 2';
          throw new Error('test');
        }
      );
      hook.after(
        `CREATE_${model.name.toUpperCase()}_RECORD`,
        function (this: any) {
          expect(this.record.name).toBe('test 2');
        }
      );
      const create = await modelInstance.create({ name: 'test' }, userCtx);
      expect(modelInstance).toBeDefined();
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toBe('test');
    }
  });
});
