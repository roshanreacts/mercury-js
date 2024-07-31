import type { Mercury } from '../../mercury';
import { GraphQLError } from "graphql";
import _ from 'lodash';
import bcrypt from "bcryptjs";
import { AfterHook } from "../../packages/platform/utility";

export interface LogifyConfig {
  options?: any;
}
export default (config?: LogifyConfig) => {
  return (mercury: Mercury) => {
    const logify = new Logify(mercury);
    logify.init(mercury);
    logify.run();
  };
};

class Logify {
  public mercury: Mercury;
  constructor(mercury: Mercury) {
    this.mercury = mercury;
  }

  init(mercury: Mercury) {
    this.mercury = mercury;
    console.log("Logify initialized");
  }

  @AfterHook
  run() {
    try {
      console.log('LogifyPlugin is running');
      // Add login and signup functionalities here
      this.mercury.addGraphqlSchema(
        `
          type Mutation {
            login(email: String, password: String): loginResponse
            signUp(email: String, password: String, firstName: String, lastName: String, profile: String): Response
          }
  
          type loginResponse {
            id: String,
            profile: String,
            session: String,
          }
  
          type Response {
            id: String
            msg: String
          }
        `,
        {
          Mutation: {
            signUp: async (root: any, { firstName, lastName, email, profile, password }: { firstName: string, lastName: string, email: string, profile: string, password: string }, ctx: any, resolverInfo: any) => {
              try {
                const user = await this.mercury.db.User.get({ email: email }, { id: '1', profile: 'SystemAdmin' });
                if (!_.isEmpty(user)) throw new Error("Email Already Registered, Please Login");
                const newUser = await this.mercury.db.User.create(
                  {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    profile: profile,
                    password: password
                  },
                  {
                    id: "1",
                    profile: "SystemAdmin",
                  },
                );
                return {  id: newUser.id, msg: "User Is Successfully Registered" };
              } catch (error: any) {
                throw new GraphQLError(error);
              }
            },

            login: async (root: any, { email, password }: { email: string; password: string }, ctx: any) => {
              try {
                const user = await this.mercury.db.User.get({ email: email }, { id: '1', profile: 'SystemAdmin' });
                if (_.isEmpty(user)) throw new GraphQLError("User Doesn't Exists");
                const isSamePassword =  await bcrypt.compare(password, user.password);
                if (!isSamePassword) throw new GraphQLError("Invalid Password");
                // create token
                // const session = jwt.sign({ user: user }, "SECRET_KEY",{ expiresIn: '2d' });
                const session = "123";
                return { id: user.id, profile: user.profile, session: session };
              } catch (error: any) {
                throw new GraphQLError(error);
              }
            },
          },
        }
      );
      console.log('Login methods are added')
    } catch (error) {
      console.log("Error in running Logify", error);
    }
  }

}