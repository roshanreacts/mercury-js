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
      {
        modelName: 'AccountHistory',
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
        floatValue: {
          type: "float",
        },
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
    },
      {
        historyTracking: true
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
    await mercury.db.Account.update(account.id, { name: "update_account" }, { id: "1", profile: "Admin" });
    const acountHistoryList = await mercury.db.AccountHistory.list({}, { id: "1", profile: "Admin" });
    expect(acountHistoryList.length).toBe(1);
    expect(acountHistoryList[0].operationType).toBe("UPDATE");
    expect(acountHistoryList[0].dataType).toBe("string");
    expect(acountHistoryList[0].fieldName).toBe("name");
  })

  it("check the updated values before and after", async () => {
    const account = await mercury.db.Account.create({
      name: "Account_1"
    }, { id: '1', profile: "Admin" });
    await mercury.db.Account.update(account.id, { name: "update_account" }, { id: "1", profile: "Admin" });
    const acountHistoryList = await mercury.db.AccountHistory.list({}, { id: "1", profile: "Admin" });
    expect(acountHistoryList.length).toBe(1);
    expect(acountHistoryList[0].oldValue).toBe("Account_1");
    expect(acountHistoryList[0].newValue).toBe("update_account");

  })

  it("check that history record is getting created for delete record", async () => {
    const account = await mercury.db.Account.create({
      name: "Account_1"
    }, { id: '1', profile: "Admin" });
    await mercury.db.Account.delete(account.id, { id: "1", profile: "Admin" });
    const acountHistoryList = await mercury.db.AccountHistory.list({}, { id: "1", profile: "Admin" });
    console.log(acountHistoryList);

    expect(acountHistoryList.length).toBe(1);
    expect(acountHistoryList[0].operationType).toBe("DELETE");

  })

  it("check for delete record should have proper values", async () => {
    const account = await mercury.db.Account.create({
      name: "Account_1"
    }, { id: '1', profile: "Admin" });
    await mercury.db.Account.delete(account.id, { id: "1", profile: "Admin" });
    const acountHistoryList = await mercury.db.AccountHistory.list({}, { id: "1", profile: "Admin" });
    console.log(acountHistoryList);

    expect(acountHistoryList.length).toBe(1);
    expect(acountHistoryList[0].operationType).toBe("DELETE");
    expect(acountHistoryList[0].newValue).toBe("UNKNOWN");
    expect(acountHistoryList[0].oldValue).toBe("Account_1");

  })

  it("check for updated variables type to be string.", async () => {
    const account = await mercury.db.Account.create({
      name: "Account_1"
    }, { id: '1', profile: "Admin" });
    await mercury.db.Account.update(account.id, { name: "Test Type" }, { id: "1", profile: "Admin" });
    const acountHistoryList = await mercury.db.AccountHistory.list({}, { id: "1", profile: "Admin" });
    console.log(acountHistoryList);

    expect(acountHistoryList.length).toBe(1);
    expect(acountHistoryList[0].operationType).toBe("UPDATE");
    expect(acountHistoryList[0].dataType).toBe("string");

  })
  it("check for updated variables type to be string.", async () => {
    const account = await mercury.db.Account.create({
      name: "Account_1"
    }, { id: '1', profile: "Admin" });
    await mercury.db.Account.update(account.id, { name: "Test Type" }, { id: "1", profile: "Admin" });
    const acountHistoryList = await mercury.db.AccountHistory.list({}, { id: "1", profile: "Admin" });
    console.log(acountHistoryList);

    expect(acountHistoryList.length).toBe(1);
    expect(acountHistoryList[0].operationType).toBe("UPDATE");
    expect(acountHistoryList[0].dataType).toBe("string");

  })

  it("check for updated variables types", async () => {
    const account = await mercury.db.Account.create({
      name: "Account_1"
    }, { id: '1', profile: "Admin" });
    const user = await mercury.db.User.create({
      name: "TestCase",
      floatValue: 121.2545,
      today: "2024-04-19T12:47:40.891Z",
      age: 12,
      check: true,
      account: account.id,
      test: ["st1", "st2", "st3", "st4"],
      roleType: "admin"
    }, { profile: "Admin", id: "132" });
    console.log(user);

    await mercury.db.User.delete(user.id, { id: "1", profile: "Admin" });
    const userHistoryList = await mercury.db.UserHistory.list({}, { id: "1", profile: "Admin" }, {});
    // const userHistoryList = await mercury.db.UserHistory.;
    console.log(userHistoryList);
    const fields = ["name", "floatValue", "age", "check", "today", "account", "test", "roleType"];
    const typeVariables: Record<string, string> = {
      "name": "string",
      "floatValue": "float",
      "age": "number",
      "check": "boolean",
      "today": "date",
      "account": "Account",
      "test": "string",
      "roleType": "enum"
    }
    userHistoryList.forEach((record: any) => {
      if (fields.includes(record.fieldName))
        expect(record.dataType).toBe(typeVariables[record.fieldName]);
    })
    // expect(userHistoryList.length).toBe(7);
    // expect(acountHistoryList[0].operationType).toBe("UPDATE");
    // expect(acountHistoryList[0].dataType).toBe("string");

  })


  it("check for updated variables records", async () => {
    const account = await mercury.db.Account.create({
      name: "Account_1"
    }, { id: '1', profile: "Admin" });
    const user = await mercury.db.User.create({
      name: "TestCase",
      floatValue: 121.2545,
      today: "2024-04-19T12:47:40.891Z",
      age: 12,
      check: true,
      account: account.id,
      test: ["st1", "st2", "st3", "st4"],
      roleType: "admin"
    }, { profile: "Admin", id: "132" });
    console.log(user);

    await mercury.db.User.update(user.id, { check: false, age: 20 }, { id: "1", profile: "Admin" });
    const userHistoryList = await mercury.db.UserHistory.list({}, { id: "1", profile: "Admin" }, {});
    console.log(userHistoryList);

    expect(userHistoryList.length).toBe(2);
    expect(userHistoryList[0].fieldName).toBe("check");
    expect(userHistoryList[0].newValue).toBe("false");
    expect(userHistoryList[1].fieldName).toBe("age");
    expect(userHistoryList[1].newValue).toBe("20");

  })

})