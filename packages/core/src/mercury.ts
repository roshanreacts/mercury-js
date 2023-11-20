import { merge } from 'lodash';
import { historySchema, defaultTypeDefs, defaultResolvers } from './utility';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import mongoose from 'mongoose';
import { Model } from './models';
import { Mgraphql } from './graphql';
import hook from './hooks';
import access from './access';

// Define a class for the Mercury ORM
class Mercury {
  // Initialize an empty array for storing models
  list: Array<TModel> = [];
  private typeDefsArr: string[] = [defaultTypeDefs];
  private resolversArr: any = defaultResolvers;
  // Initialize an empty object for storing models by name
  db: {
    [modelName: string]: Model;
  } = {};
  get typeDefs() {
    return mergeTypeDefs(this.typeDefsArr);
  }

  get resolvers() {
    return mergeResolvers(this.resolversArr);
  }

  public createProfile(name: string, rules: Rule[]): void {
    access.createProfile(name, rules);
  }

  public package(packages: Array<(mercury: Mercury) => void>) {
    packages.map((pkg) => pkg(this as any));
  }
  public connect(path: string) {
    mongoose.connect(path);
  }
  public async disconnect() {
    await mongoose.disconnect();
    await mongoose.connection.close();
  }
  // Create a new model with the specified name, fields, and options
  public createModel<ModelType>(
    name: string,
    fields: TFields,
    options?: TOptions
  ): void {
    // Define default options for the model
    const defaultOptions = {
      historyTracking: false,
      private: false,
    };

    // Merge the specified options with the default options
    options = merge(defaultOptions, options);

    // Create a new model object with the specified name, fields, and options
    const model: TModel = { name, fields, options };

    // Execute the CREATE_MODEL hook before creating the model
    hook.execBefore('CREATE_MODEL', model, (error: any) => {
      if (error) {
        throw error;
      }
    });

    // Add the model to the list of models
    this.list.push(model);

    // Create a new Model instance for the model and add it to the database
    this.db[name] = new Model(model);

    // If the model is private, do not add graphql typedefs
    if (!options.private) {
      // Create graphql typedefs
      this.typeDefsArr.push(Mgraphql.genModel(name, fields, options));
      const createResolvers = Mgraphql.genResolvers(name, this.db[name]);
      this.resolversArr = mergeResolvers([this.resolversArr, createResolvers]);
    }

    // If historyTracking is true, create a history model for the model
    if (options.historyTracking) {
      const historyModel: TModel = {
        name: `${name}History`,
        fields: historySchema(name),
      };
      this.list.push(historyModel);
      this.db[name] = new Model({
        name: historyModel.name,
        fields: historyModel.fields,
        options: { historyTracking: false },
      });

      // If the model is private, do not add history graphql typedefs
      if (!options.private) {
        this.typeDefsArr.push(
          Mgraphql.genModel(historyModel.name, historyModel.fields)
        );
        const createHistoryResolvers = Mgraphql.genResolvers(
          name,
          this.db[name]
        );
        this.resolversArr = mergeResolvers([
          this.resolversArr,
          createHistoryResolvers,
        ]);
      }
    }
  }
}

// Create a new instance of the Mercury class and export it
const mercury: Mercury = new Mercury();
export { hook, access };
export default mercury;
