import mercury from '../src/mercury';

describe('Mercury', () => {
  it('should create a model', () => {
    const name = 'User';
    const fields = {
      name: {
        type: 'string',
        isRequired: true,
      },
      age: {
        type: 'number',
        isRequired: true,
      },
    };
    const options = {
      historyTracking: true,
    };
    mercury.createModel(name, fields, options);
    expect(mercury.list.length).toBe(2);
    expect(mercury.list[0].name).toBe('User');
    expect(mercury.list[1].name).toBe('UserHistory');
  });

  it('should create a model without history', () => {
    const name = 'Customer';
    const fields = {
      name: {
        type: 'string',
        isRequired: true,
      },
      age: {
        type: 'number',
        isRequired: true,
      },
    };
    const options = {
      historyTracking: false,
    };
    mercury.createModel(name, fields, options);
    expect(mercury.list[2].name).toBe('Customer');
    expect(
      mercury.list.find((model) => model.name === 'CustomerHistory')
    ).toBeUndefined();
  });

  it('should add db instance', () => {
    const name = 'Test';
    const fields = {
      name: {
        type: 'string',
        isRequired: true,
      },
      age: {
        type: 'number',
        isRequired: true,
      },
    };
    const options = {
      historyTracking: false,
    };
    mercury.createModel(name, fields, options);
    mercury.db[name].create();
    expect(mercury.db[name]).toBeDefined();
    expect(mercury.db[name].create).toBeDefined();
  });
});
