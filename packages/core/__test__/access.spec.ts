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
  });

  it('should validate access', () => {
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
      {
        modelName: 'User',
        access: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      },
    ];
    access.createProfile(name, rules);
    const user = {
      id: '1',
      profile: 'User',
    };
    const result = access.validateAccess('Account', 'read', user, [
      'name',
      'age',
    ]);
    expect(result).toBe(false);
  });

  it('should deep validate field level access', () => {
    const user = {
      id: '1',
      profile: 'User',
    };
    const result = access.validateDeepAccess(
      [
        {
          path: 'User',
          select: ['name', 'age'],
          populate: [{ path: 'Account', select: ['name'] }], //as no age is selected it is true
        },
      ],
      'read',
      user
    );
    expect(result).toBe(true);
  });

  it('should extend a profile', () => {
    const name = 'SuperAdmin';
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
        },
      },
    ];
    access.createProfile(name, rules);
    const accessCheck = access.validateAccess(
      'Account',
      'create',
      { id: '1', profile: 'SuperAdmin' },
      ['name', 'age']
    );
    expect(accessCheck).toBe(false);
    const rules2 = [
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
    access.extendProfile(name, rules2);
    expect(
      access.profiles.find((profile) => profile.name === name)
    ).toBeDefined();
    expect(
      access.profiles.find((profile) => profile.name === name)?.rules.length
    ).toBe(2);
    const accessCheckPostExtend = access.validateAccess(
      'Account',
      'create',
      { id: '1', profile: 'SuperAdmin' },
      ['name', 'age']
    );
    expect(accessCheckPostExtend).toBe(true);
  });
});
