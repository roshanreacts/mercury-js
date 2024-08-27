import type { Mercury } from '../../mercury';
import { GraphQLError } from "graphql";
import _ from 'lodash';
import { AfterHook } from "../../packages/platform/utility";
import type { Platform } from '../../packages/platform';
import jwt from 'jsonwebtoken';

interface LogifyConfig { JWT_SECRET: string, JWT_EXPRIES_IN: string }
export default (options: LogifyConfig) => {
  return (platform: Platform) => {
    const logify = new Logify(platform.mercury, platform, options);
    logify.init(platform.mercury);
    logify.run();
  };
};

class Logify {
  public mercury: Mercury;
  public platform: Platform;
  public options: LogifyConfig;
  constructor(mercury: Mercury, platform: Platform, options: LogifyConfig) {
    this.mercury = mercury;
    this.platform = platform;
    this.options = options;
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

      //signUp(email: String, password: String, firstName: String, lastName: String, profile: String): Response
      this.mercury.addGraphqlSchema(
        `
          type Mutation {
            SignIn(email: String, password: String): SignInResponse
          }
  
          type SignInResponse {
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
            // signUp: async (root: any, { firstName, lastName, email, profile, password }: { firstName: string, lastName: string, email: string, profile: string, password: string }, ctx: any, resolverInfo: any) => {
            //   try {
            //     const user = await this.mercury.db.User.get({ email: email }, { id: '1', profile: 'SystemAdmin' });
            //     if (!_.isEmpty(user)) throw new Error("Email Already Registered, Please Login");
            //     const newUser = await this.mercury.db.User.create(
            //       {
            //         firstName: firstName,
            //         lastName: lastName,
            //         email: email,
            //         profile: profile,
            //         password: password
            //       },
            //       {
            //         id: "1",
            //         profile: "SystemAdmin",
            //       },
            //     );
            //     return { id: newUser.id, msg: "User Is Successfully Registered" };
            //   } catch (error: any) {
            //     throw new GraphQLError(error);
            //   }
            // },
            SignIn: async (root: any, { email, password }: { email: string; password: string }, ctx: any) => {
              try {
                const user = await this.mercury.db.User.get({ email }, { id: '1', profile: 'SystemAdmin' });
                if (_.isEmpty(user)) throw new GraphQLError("User Doesn't Exists");
                const isSamePassword = await user.verifyPassword(password);
                if (!isSamePassword) throw new GraphQLError("Invalid Password");
                const session = jwt.sign({ user: user }, this.options.JWT_SECRET, { expiresIn: this.options.JWT_EXPRIES_IN });
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