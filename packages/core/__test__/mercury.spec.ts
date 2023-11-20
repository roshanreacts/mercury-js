import mercury from '../src/mercury';

const UserSchema: listSchema = {
  fields: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    email: {
      type: 'string',
      isRequired: true,
      unique: true,
    },
    organization: {
      type: 'string',
    },
    zipcode: {
      type: 'string',
    },
    role: {
      type: 'enum',
      enumType: 'string',
      enum: ['USER', 'ADMIN', 'SUPERADMIN', 'APPLICATIONOWNER'],
      default: 'USER',
    },
    region: {
      type: 'string',
    },
    oktaId: {
      type: 'string',
    },
    isActive: {
      type: 'boolean',
      default: false,
    },
  },
  access: {
    default: true,
    acl: [
      {
        SUPERADMIN: { create: true, read: true, update: true, delete: true },
      },
      { ADMIN: { create: true, read: true, update: true, delete: true } },
      { EMPLOPYEE: { create: false, read: true, update: true, delete: false } },
      {
        ANONYMOUS: { read: false, update: false, delete: false, create: false },
      },
    ],
  },
  enableHistoryTracking: true,
};
mercury.createList('User', UserSchema);

describe('mockMongoose', () => {
  // setup();
  beforeAll(async () => {
    // @ts-ignore
    mercury.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    // @ts-ignore
    await mercury.disconnect();
  });

  it('should connect to the database', async () => {
    expect(mercury.db.User).toBeDefined();
  });

  it('should create a user', async () => {
    const User = mercury.db.User;
    const user = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'testJohn@gmail.com',
      organization: 'Mercury',
      zipcode: '12345',
      role: 'USER',
      region: 'US',
      oktaId: '12345',
      isActive: true,
    });
    await user.save();

    const getUser = await User.findOne({ email: 'testJohn@gmail.com' });
    expect(user).toBeDefined();
    expect(getUser).toBeDefined();
    expect(getUser.oktaId).toBe('12345');
  });
  it('should create a user history', async () => {
    const UserHistory = mercury.db.UserHistory;
    expect(UserHistory).toBeDefined();
  });
});
