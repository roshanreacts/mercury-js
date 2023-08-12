import access from '../src/access';

describe('Access', () => {
  it('should create a profile', () => {
    const name = 'Admin';
    const rules = [
      {
        modelName: 'User',
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
          age: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
        },
      },
    ];
    access.createProfile(name, rules);
    expect(access.profiles.length).toBe(1);
    expect(access.profiles[0].name).toBe('Admin');
    expect(access.profiles[0].rules[0].modelName).toBe('User');
    expect(access.profiles[0].rules[0].fields.name).toBeDefined();
  });

  it('should validate access', () => {
    const name = 'Admin';
    const rules = [
      {
        modelName: 'User',
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
          age: {
            create: true,
            read: false,
            update: true,
            delete: true,
          },
        },
      },
    ];
    access.createProfile(name, rules);
    const user = {
      id: '1',
      profile: 'Admin',
    };
    const result = access.validateAccess('User', 'read', user, ['name', 'age']);
    expect(result).toBe(true);
  });

  it('should validate field level access', () => {
    const name = 'User';
    const rules = [
      {
        modelName: 'Account',
        access: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        fieldLevelAccess: true,
        fields: {
          name: {
            create: true,
            read: true,
            update: true,
            delete: true,
          },
          age: {
            create: true,
            read: false,
            update: true,
            delete: true,
          },
        },
      },
    ];
    access.createProfile(name, rules);
    const user = {
      id: '1',
      profile: 'User',
    };
    const result = access.validateAccess('User', 'read', user, ['name', 'age']);
    expect(result).toBe(false);
  });
});
