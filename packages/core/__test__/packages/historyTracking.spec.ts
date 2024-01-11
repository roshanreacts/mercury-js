import mercury from "../../src/mercury";
import historyTracking from "../../src/packages/historyTracking";
import * as db from '../db';
import access from '../../src/access';


describe('History Tracking', () => {

  beforeAll(async () => {
    console.log("First")
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
      },
      {
        modelName: 'Account',
        access: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      },
      {
        modelName: 'UserHistory',
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
    mercury.createModel("User",
      {
        name: {
          type: "string",
        },
        // floatValue: {
        //   type: "float",
        // },
        today: {
          type: "date",
        },
        age: {
          type: "number",
        },
        check: {
          type: "boolean",
        },
        account: {
          type: "relationship",
          ref: "Account",
        },
        test: {
          type: "string",
          many: true
        },
        testv: {
          type: "virtual",
          ref: "Account",
          localField: "account",
          foreignField: "_id",
          many: false,
        },
        accPass: {
          type: "string",
        },
        roleType: {
          type: "enum",
          enum: ["admin", "user"],
          enumType: "string",
        },
      },
      {
        historyTracking: true
      }
    );
    mercury.createModel('Account', {
      name: {
        type: "string",
      },
      user: {
        type: "relationship",
        ref: "User",
      },
    });
    mercury.package([historyTracking()]);
  })
  afterEach(async () => {
    await db.dropCollections();
  });

  afterAll(async () => {
    await db.dropDatabase();
  });
  it('It should create history records while updating', async () => {
    const account = await mercury.db.Account.create({
      name: "Account_1"
    }, { id: '1', profile: "Admin" });
    const user = await mercury.db.User.create({
      // "test": [
      //   "test",
      //   "Field"
      // ],
      // "accPass": "accPassfield",
      // "account": account._id,
      // "name": "nameField",
      // "roleType": "admin",
      "age": 22,
      "check": true,
    }, { id: "1", profile: "Admin" });
    const account_2 = await mercury.db.Account.create({
      name: "Account_2"
    }, { id: '1', profile: "Admin" });
    // await mercury.db.User.update(user.id, { name: "kratos", age: 23, account: account_2._id , today: Date.now() }, { id: "1", profile: "Admin" });
    await mercury.db.Account.update(account.id, { name: "update_account"}, { id: "1", profile: "Admin" });
    const userHistoryList = await mercury.db.UserHistory.list({}, { id: "1", profile: "Admin" });
    // expect(userHistoryList.length).toBe(3);
    // console.log("list models", mercury.list);
    // console.log("User history Update action records", await mercury.db.UserHistory.list({}, { id: "1", profile: "Admin" }));
    // console.log("Account history update action records", await mercury.db.AccountHistory?.list({}, { id: "1", profile: "Admin" }));
    await mercury.db.User.delete(user.id, { id: "1", profile: "Admin" });
    console.log("User history delete action records", await mercury.db.UserHistory.list({}, { id: "1", profile: "Admin" }));
  })
})