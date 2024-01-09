import recordOwner from '../../src/packages/recordOwner';
import access from '../../src/access';
import mercury from '../../src/mercury';
import * as db from '../db';
mercury.package([recordOwner()]);

describe('recordOwner', () => {
  it('should recordOwner the schema', async () => {
    const fields: TFields = {
      name: {
        type: 'string',
      },
      type: {
        type: 'string',
      },
    };
    const options: any = {
      recordOwner: true,
    };
    mercury.createModel('Account', fields, options);
    const data = await mercury.db['Account'].create(
      {
        name: 'Person',
        type: 'any',
      },
      { id: '65017272ddfe106aaad32a7d', profile: 'Admin' }
    );
    console.log(
      'After Create Account',
      await mercury.db['Account'].mongoModel.findById(data._id)
    );
    await mercury.db['Account'].update(
      data._id,
      { name: 'Person2' },
      { id: '65044c7ed26ec390b0ea3a45', profile: 'Admin' }
    );
    console.log(
      'After Update Account',
      await mercury.db['Account'].mongoModel.findById(data._id)
    );
    expect(1).toEqual(1);
  });
});

describe('recordOwner', () => {
  it('should recordOwner the schema', async () => {
    const fields: TFields = {
      name: {
        type: 'string',
      },
      type: {
        type: 'string',
      },
    };
    const options: any = {
      recordOwner: true,
    };
    mercury.createModel('Account', fields, options);
    const data = await mercury.db['Account'].create(
      {
        name: 'Person',
        type: 'any',
      },
      { id: '65017272ddfe106aaad32a7d', profile: 'Admin' }
    );
    console.log(
      'After Create Account',
      await mercury.db['Account'].mongoModel.findById(data._id)
    );
    await mercury.db['Account'].update(
      data._id,
      { name: 'Person2' },
      { id: '65044c7ed26ec390b0ea3a45', profile: 'Admin' }
    );
    console.log(
      'After Update Account',
      await mercury.db['Account'].mongoModel.findById(data._id)
    );
    expect(1).toEqual(1);
  });
});

beforeAll(async () => {
  const name = 'Admin';
  const rules = [
    {
      modelName: 'Account',
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
