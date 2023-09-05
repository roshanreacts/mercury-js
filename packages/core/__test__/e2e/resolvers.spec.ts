import * as db from '../db';
import access from '../../src/access';

describe('should call a resolvers', () => {
  beforeAll(async () => {
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
    await db.setUp();
  });
  afterEach(async () => {
    await db.dropCollections();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });
  it('should call a resolvers', () => {
    expect(true).toBe(true);
  });
});
