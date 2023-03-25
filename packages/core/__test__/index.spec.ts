import mercury from '../dist/cjs/index'
import { TodoSchema, TodoGql, UserSchema, UserGql } from './sampleModel.mock'
describe('Init mercury', () => {
  // Init the mercury config
  // mercury.roles = ["HELO", "STATUS"];
  // mercury.adminRole = "HELO";
  it('should initialize mercury', () => {
    expect(mercury.resolvers).toBeDefined()
  })
  it('should create list', () => {
    // mercury.createList("Todo", TodoSchema);
    mercury.createList('User', UserSchema)

    expect(mercury.schema).toBeDefined()
    expect(mercury.resolvers).toBeDefined()
    expect(mercury.db).toBeDefined()
    expect(mercury.roles).toStrictEqual(['SUPERADMIN', 'USER', 'ANONYMOUS'])
    expect(mercury.adminRole).toBe('SUPERADMIN')
  })
  // it("should bcrypt password", async () => {
  //   const UserModel = mercury.dataModels.Models.UserModel;
  //   const newUser = new UserModel({
  //     firstName: "John",
  //     password: "Roshan@123",
  //   });
  //   await newUser.save();
  //   expect(UserModel).toBeDefined();
  // });
})
